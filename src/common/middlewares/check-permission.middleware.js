import { BadRequestException } from "../helpers/error.helper.js"
import { prisma } from "../prisma/init.prisma.js"

const checkPermission = async (req, res, next) => { 
    try {


        //gom dữ liệu cần thiết để ktra permissions      
        const user = req.user
        const role_id = user.role_id
        const baseUrl = req.baseUrl
        const routePath = req.route.path
        // const fullPath = baseUrl + routePath
        const fullPath =`${baseUrl}${routePath}`
        const method = req.method
        
        //Nếu là admin (role_id === 1) thì cho qua
        //Bắt buộc phải có return nếu ko code sẽ chạy tiếp tục các dòng dưới IF
        if(role_id === 1) return next()

        //Đi tìm id của permission thông qua fullPath và method
        const permission = await prisma.permissions.findFirst({
            where:{
                endpoint:fullPath,
                method
            }
        })

        const role_permission = await prisma.role_permissions.findFirst({
            where:{
                role_id,
                permission_id: permission.permission_id,
                is_active: true
            }
        })

        if(!role_permission){
            throw new BadRequestException(`Bạn ko đủ quyền sử dụng tài nguyên (API) này`)
        }

        next()
    } catch (error) {
        next(error)
    }
 }

 export default checkPermission