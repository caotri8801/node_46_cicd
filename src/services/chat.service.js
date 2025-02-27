import { prisma } from "../common/prisma/init.prisma.js";

export const chatService = {
   create: async function (req) {
      return `This action create`;
   },

   findAll: async function (req) {
      return `This action returns all chat`;
   },

   findOne: async function (req) {
      return `This action returns a id: ${req.params.id} chat`;
   },

   update: async function (req) {
      return `This action updates a id: ${req.params.id} chat`;
   },

   remove: async function (req) {
      return `This action removes a id: ${req.params.id} chat`;
   },

   listUserChat: async function (req) {
    let {page, pageSize, search, notMe} = req.query
        
        //đổi string sang int và set điều kiện value > 0
        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 10;
        search = search || ``
        notMe  = notMe === `true` ? true : false //chuyển string true sang bolean

        // throw new BadRequestException()
        // const videos = await models.videos.findAll({raw:true})
        // findMany bên prisma tương đương findAll bên sequelize

        

        const whereNotMe = notMe === true ? { user_id: { not: req.user.user_id } } : {};
        const whereSearch = search.trim() === `` ? {} : { video_name: { contains: search } };
        const where = { ...whereNotMe, ...whereSearch };
  

        //vd: LIMIT 5 Offset 5
        const skip = (page - 1) * pageSize
        const totalItem = await prisma.users.count({where:where})
        const totalPage = Math.ceil(totalItem / pageSize)


        const users = await prisma.users.findMany({
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
            items: users || [], //ko có trả về mảng rỗng để hạn chế lỗi trắng trang
        }
   },
};