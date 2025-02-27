import { BadRequestException } from "../common/helpers/error.helper.js"
import Cars from "../models/Cars.model.js"

const carService = {
    carList: async(req) => {  
        // Lỗi kiểm soát được
      // 400, 403, 401
      const passNguoiDungGuiLen = 123
      const passLayTrongDb = 1235
      // abc
      // if(passNguoiDungGuiLen !== passLayTrongDb) {
      //   //throw giống return: ngắt code giống nhau
      //    throw new BadRequestException(`Mật khẩu không chính xác`)
      // }

      // Lỗi không kiểm soát được
      // mã code: 500
      // abc


        const {page} = req.query
        //Đánh async ở function gần nhất đang bọc await
        // const cars = await sequelize.query(`SELECT * FROM cars`)
        const cars = await Cars.findAll({raw:true})
    
        // console.log({cars})
        // console.log(`cars-1`, cars[0])
        
        // res.json(cars[0])
        return cars
    }
}
export default carService