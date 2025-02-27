
import express from 'express'
import carController from '../controllers/car.controller.js'

const carRouter = express.Router()

// api cho bộ carRouter
carRouter.get(`/cars-list`, carController.carList)

// carController.carList() : chạy hàm
// carController.carList : dán hàm vào chứ ko chạy
// Ban đầu của ta là 1 function chứ ko có chạy hàm sau đó ta để function cho ghọn bên controller. Nên ở đây ta chị được dán fucntion chứ ko chạy hàm thì mới đúng
export default carRouter

// CALLBACK FUNCTION
// vd: 
// const tinhtoan = (path, handlers) =>{
//     path,
//     const req=null
//     const res;
//     function next(params){

//     }
//     handlers(req, res, next)
// }

// tinhtoan(`\cars`,(res,req,next)=>{})

// tham chiếu
// Array, object
// tham trị
// Number, string

