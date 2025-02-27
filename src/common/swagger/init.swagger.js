import video from "./video.swagger.js"

const swaggerDocument = {
    openapi: "3.1.0",
    info: {
        title:"Đây là title",
        version:"1.0.0.0.0"
    },
    servers: [
       {
         url: "http://localhost:3070",
         description: "server tại local"
       }
    ],
    components: {
        securitySchemes: {
            tuanTranToken: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            }
        }
    },
    paths: {
        ...video,
    }
}

export default swaggerDocument