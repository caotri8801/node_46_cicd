
import { responseSuccess } from '../common/helpers/response.helper.js'
import videoService from '../services/video.service.js'

const videoController = {
    videoList: async (req, res, next) => {
        try {
            const videos = await videoService.videoList(req)

            const resData = responseSuccess(videos, `Get List Video Successfully`, 200)


            // status (...) mã lỗi trả về
            res.status(resData.code).json(resData)
        } catch (error) {
            next(error)
        }

    },
    videoDetail: async (req, res, next) => {
        try {
            const videos = await videoService.videoDetail(req)

            const resData = responseSuccess(videos, `Get Detail Video Successfully 123`, 200)


            // status (...) mã lỗi trả về
            res.status(resData.code).json(resData)
        } catch (error) {
            next(error)
        }

    }
    
}
export default videoController