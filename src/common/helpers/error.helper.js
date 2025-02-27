import multer from "multer";
import { responseError } from "./response.helper.js";
import jwt from 'jsonwebtoken'


export const handleError = (err, req, res, next) => { 

    //401: logout
    //403: refreshToken
    // 02 mã này sẽ do FE và BE tự quy định với nhau

    //JsonWebTokenError những lỗi còn lại của Jsonwebtoken    
    if(err instanceof jwt.JsonWebTokenError){
        err.code = 401
     }
     //kiểm tra error có thuộc instant của tokenexpired ko
    if(err instanceof jwt.TokenExpiredError){
        err.code = 403
     }
     //Cover lỗi của Multer

     if (err instanceof multer.MulterError) {
        err.code = 400;
     }
    // console.log(`middleware bắt lỗi cuỗi cùng`);  
    const resData = responseError(err.message,err.code,err.stack)

    res.status(resData.code).json(resData)
}


export class BadRequestException extends Error {
    constructor(message = `BadRequestException`) {
        //super là chạy hàm contructor của class cha mà mình extends. ở đây là class Error(ghi đè)
        super(message)
        this.code = 400
    }
}

export class UnauthorizationException extends Error {
    constructor(message = `UnauthorizationException`) {
        super(message)
        this.code = 401
    }
}

export class ForbiddenRequestException extends Error {
    constructor(message = `ForbiddenRequestException`) {
        //super là chạy hàm contructor của class cha mà mình extends. ở đây là class Error(ghi đè)
        super(message)
        this.code = 403
    }
}


