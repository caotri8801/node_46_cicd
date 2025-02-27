
import { PrismaClient } from "@prisma/client"
import { BadRequestException } from "../common/helpers/error.helper.js"
import models, { sequelize } from "../common/sequelize/init.sequelize.js"

//nhớ lấy đúng thư viện PrismaClient
const prisma = new PrismaClient()

const videoService = {
    
    videoList: async(req) => {  
        let {page, pageSize, type_id, search} = req.query
        console.log({page, pageSize, type_id, search})
        //đổi string sang int và set điều kiện value > 0
        page = +page > 0 ? +page : 1;
        pageSize = +pageSize > 0 ? +pageSize : 10;
        type_id = +type_id > 0 ? +type_id : 0;
        search = search || ``

        // throw new BadRequestException()
        // const videos = await models.videos.findAll({raw:true})
        // findMany bên prisma tương đương findAll bên sequelize

        

        const whereTypeId = type_id === 0 ? {} : {type_id:type_id}
        const whereSearch = search.trim() === `` ? {} : { video_name: {
            contains: search,
        }}

        const where = {...whereTypeId, ...whereSearch}

        //vd: LIMIT 5 Offset 5
        const skip = (page - 1) * pageSize
        const totalItem = await prisma.videos.count({where:where})
        const totalPage = Math.ceil(totalItem / pageSize)


        console.log({userDayne: req.user})
        const videos = await prisma.videos.findMany({
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
            items: videos || [], //ko có trả về mảng rỗng để hạn chế lỗi trắng trang
        }
    },
    
    videoDetail: async(req) => {  
        const {id} = req.params
        if(!id) throw new BadRequestException(`Vui lòng cung cấp Id của Video`)

        const video = await prisma.videos.findUnique({
            where: {
                video_id: +id
            }
        })

        
        return video
    }

}

export default videoService