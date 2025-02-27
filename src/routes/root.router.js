import express from 'express'
import videoRouter from './video.router.js'
import carRouter from './car.router.js';
import authRouter from './auth.router.js';
import roleRouter from './role.router.js';
import permissionRouter from './permission.router.js';
import swaggerUi from "swagger-ui-express"
import swaggerDocument from '../common/swagger/init.swagger.js'; 
import chatRouter from './chat.router.js';
import { userController } from '../controllers/user.controller.js';
import userRouter from './user.router.js';

//Bộ root lớn nhất quản lý các bộ khác
// để import đanh videoRouter sau đó ctrl + space 

const rootRouter = express.Router()
//swaggerUi.serve xây dựng UI swagger
rootRouter.use('/api-docs', swaggerUi.serve);
//swaggerUi.setup vô file swaggerDocument đọc thông tin API version mình mong muốn để xây dựng API
rootRouter.get('/api-docs', (req, res) => { 
    const urlNew = `${req.protocol}://${req.get(`host`)}`
    // console.log({urlNew})

    const isUrl = swaggerDocument.servers.find((item) => { 
        const isFind = item.url === urlNew
        return isFind
     })

     if(!isUrl){

         swaggerDocument.servers.unshift( 
            {
            url: urlNew,
            description: "server tại local"
          }
        )
     }

    swaggerUi.setup(swaggerDocument, {swaggerOptions:{persistAuthorization:true}})(req, res) });

//Check server (healthycheck)
rootRouter.get(`/`, (request, response, next) => {
    response.json(`OK`);

});

// use là middleware khác get, post (dùng use để ko quy định cụ thể là get hay post,v.v..) - Chỉ nên dùng get và post ở điểm cuối, use có ý nghĩa là tất cả request(get, post, put, delete) sẽ vô đc root. Trung gian nên dùng use

// gôm bộ videoRouter về bộ rootRouter
rootRouter.use('/video',videoRouter)

rootRouter.use('/car', carRouter)
// rootRouter.use('/user', userRouter)
// rootRouter.use('/role', roleRouter)

//
rootRouter.use('/auth', authRouter)

rootRouter.use('/role', roleRouter)

rootRouter.use('/permission', permissionRouter)

rootRouter.use('/chat', chatRouter)

rootRouter.use(`/user`, userRouter)



export default rootRouter