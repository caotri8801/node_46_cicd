import { BadRequestException } from "../common/helpers/error.helper.js";
import { prisma } from "../common/prisma/init.prisma.js";

export const roleService = {
   create: async function (req) {
      return `This action create`;
   },

   findAll: async function (req) {
    let {page, pageSize, search} = req.query
    //đổi string sang int và set điều kiện value > 0
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;
    search = search || ``
    
    const whereSearch = search.trim() === `` ? {} : { name: {
        contains: search,
    }}

    const where = { ...whereSearch}

    //vd: LIMIT 5 Offset 5
    const skip = (page - 1) * pageSize
    const totalItem = await prisma.roles.count({where:where})
    const totalPage = Math.ceil(totalItem / pageSize)


    const roles = await prisma.roles.findMany({
        take: pageSize,
        skip: skip,
        orderBy:{
            created_at: `desc` // sắp xếp giảm dần: đưa vid mới nhất lên trên đầu
        },
        where: where
    })

    return {
        page, //trang hiện tại
        pageSize, //kích thước item trong 1 page (vd 10 vid trong 1 page)
        totalPage, //tổng cộng bao nhiêu trang
        totalItem, // tổng cộng có bao nhiêu item
        items: roles || [], //ko có trả về mảng rỗng để hạn chế lỗi trắng trang
    }
   },

   findOne: async function (req) {
    const {id} = req.params
    const role = prisma.roles.findUnique({
        where: {
            role_id: +id, //thêm dấu + để chuyển từ chuổi sang number vì dữ liệu gửi ở param luôn là chuổi
        }
    })
      return role;
   },

   update: async function (req) {
      return `This action updates a id: ${req.params.id} role`;
   },

   remove: async function (req) {
      return `This action removes a id: ${req.params.id} role`;
   },
   togglePermission: async (req) =>{
    const {role_id, permission_id} = req.body
    let rolePermisionExist = await prisma.role_permissions.findFirst({
        where:{
            role_id,
            permission_id
        }
    })
    if(rolePermisionExist){
        //Nếu tồn tại thì cập nhật lại trạng thái is_active(lật lại trạng thái)
        rolePermisionExist = await prisma.role_permissions.update({
            where:{
                role_permissions_id: rolePermisionExist.role_permissions_id
            },
            data:{
                is_active: !rolePermisionExist.is_active
            }
        })
    }else{
        //Nếu chưa tồn tại tạo mới
        rolePermisionExist = await prisma.role_permissions.create({
            //lấy dữ liệu người dùng gửi lên chứ ko lấy trong rolePermisionExist do nó đâu có tồn tại mà mấy
            data:{
                role_id,
                permission_id,
                is_active: true
            }
        })

    }


     return rolePermisionExist
   }
};