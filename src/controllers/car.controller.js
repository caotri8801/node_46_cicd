
import { responseSuccess } from "../common/helpers/response.helper.js";
import carService from "../services/car.service.js";

const carController = {
    carList: async (req, res, next) => {

        //Nên bọc try ở lớp ngoài cùng (try bảo vệ app ko crashed khi gặp lỗi ko kiểm soát được)
        try {
            const cars = await carService.carList(req);
            const resData = responseSuccess
                (cars, `Get List Car Successfully`, 200)
            res.status(resData.code).json(resData)
        } catch (error) {
            // console.log(error)
            // console.log(`123`)

            // const resData = responseError(error.message,error.code,error.stack)

            // res.status(resData.code).json(resData)

            next(error)
        }



        // const resData = {
        //     status: `success`,
        //     code:200,
        //     message:`Get List Car Successfully`,
        //     metaData: cars,
        //     doc:`api.domain.com/doc`
        // }

    }
}

export default carController