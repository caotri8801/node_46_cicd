import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant.js";
import { prisma } from "../prisma/init.prisma.js";
import { UnauthorizationException } from "../helpers/error.helper.js";

export const protect = async (req, res, next) => {
  try {

    //Thêm ? để ko mắc lỗi plit trả về 500 bị FE đổ thừa
    const accessToken = req.headers.authorization?.split(" ")[1];
    if(!accessToken){
        throw new UnauthorizationException(`Vui lòng cung cấp token để tiếp tục sử dụng`);
    }

    //jwt sẽ verify trường VERIFY SIGNATURE của accessToken với ACCESS_TOKEN_SECRET để return ok hay throw lỗi
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    // console.log({ decode });

    //Tìm người dùng
    const user = await prisma.users.findUnique({
        where:  {
            user_id: decode.userId
        },
        include: {
          roles: true
        }
    })

    //truyền data qua các middleware khác
    req.user= user;

    next();
  } catch (error) {
    next(error);
  }
};
