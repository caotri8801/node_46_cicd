import express from 'express'

import videoController from '../controllers/video.controller.js'
import { protect } from '../common/middlewares/protect.middleware.js'
import checkPermission from '../common/middlewares/check-permission.middleware.js'
//chú ý nhớ thêm đuôi .js vì expressJs nó quan tâm đuôi .js

// Bộ video

const videoRouter = express.Router()

// api cho bộ videoRouter
videoRouter.get('/video-list',protect,checkPermission,
//     (req, res, next) => { console.log(`middleware kiểm tra dữ liệu đầu vào`);  
//     next()
// }, 
videoController.videoList)

videoRouter.get('/video-detail/:id',protect,
    //     (req, res, next) => { console.log(`middleware kiểm tra dữ liệu đầu vào`);  
    //     next()
    // }, 
    videoController.videoDetail)


export default videoRouter