import { ACCESS_TOKEN_EXPIRED, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRED, REFRESH_TOKEN_SECRET } from "../common/constant/app.constant.js"
import { BadRequestException, UnauthorizationException } from "../common/helpers/error.helper.js"
import sendMail from "../common/nodemailer/send-mail.nodemailer.js"
import { prisma } from "../common/prisma/init.prisma.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const authService = {
    //api
    register: async (req) => {
        // Bước 1: nhận dữ liệu: full_name, email, pass_word
        const {full_name, email, pass_word} = req.body
        // console.log({full_name, email, pass_word})

        // Bước 2: lấy email và kiểm tra trong db xem đã có người dùng đó hay chưa
        const userExists = await prisma.users.findFirst({
            where:{
                email: email
            }
        })

        // console.log({userExists})
        if(userExists){
            throw new BadRequestException(`Tài khoản đã tồn tại`)
        }

        // mã hóa pwd
        const passHash = bcrypt.hashSync(pass_word, 10);


        // Bước 3: tạo người dùng mới
        //key có "?" có hay ko có củng ko sao, còn ko có "?" bắt buộc phải có (trong gợi ý prisma)
        const userNew = await prisma.users.create({
            data: {
                email: email,
                full_name: full_name,
                pass_word: passHash
            }
        })
        // xóa pwd khi trả về
        delete userNew.pass_word
        //userNew.pass_word= `1234`

         // gửi email chào mừng
      // 1 - tốc độ: đăng ký nhanh và không cần đợi quá trình xử lý email => bỏ await
      // 2 - chắc chắn: đăng ký chậm và cần phải đợi email gửi thành công => await
        sendMail(userNew.email).catch((err) => { 
            console.log(`Lỗi gửi email:`,err)
         })

        // Bước 4: trả kết quả thành công
        return userNew
    },
    login: async (req) => {
        const {email, pass_word} = req.body

        const userExists = await prisma.users.findFirst({
            where:{
                email:email
            },

        })
        //null, false, undefined
        if(!userExists){
            throw new BadRequestException(`Tài khoản chưa tồn tại. Vui lòng đăng ký`)
        }

        if(!userExists.pass_word){
            if(userExists.face_app_id){
                throw new BadRequestException(`Vui lòng đăng nhập bằng FB, để cập nhật mk mới`)
            }
            if(userExists.goole_id){
                throw new BadRequestException(`Vui lòng đăng nhập bằng GG, để cập nhật mk mới`)
            }
            throw new BadRequestException(`Không hợp lệ, vui lòng liên hệ CSKH`)
        }

        //bcrypt chỉ so sánh pwd chứ ko phải dịch ngược rồi đi so sánh.
        const isPassword = bcrypt.compareSync(pass_word,userExists.pass_word)

        if(!isPassword){
            throw new BadRequestException(`Mật khẩu không đúng`)
        }

        // Tạo access token
        const tokens = authService.createTokens(userExists.user_id);

        return tokens
    },

    facebookLogin: async(req) => { 
       
        const {name, email, picture, id} = req.body
        const avatar = picture.data.url
        console.log({name, email, avatar, id});

        let userExists = await prisma.users.findFirst({
            where: {
                email:email
            }
        })

        if(!userExists){
            userExists = await prisma.users.create({
                data:{
                    email:email,
                    full_name: name,
                    face_app_id: id
                }
            })
        }

         // Tạo access token
         const tokens = authService.createTokens(userExists.user_id);

         return tokens

     },
    refreshToken: async(req) => { 
        //Lưu ý tất cả lỗi trả về 401 UnauthorizationException để FE force logout
        //refreshToken thì làm ngược lại protect.middle ý đồ bảo mật
        const refreshToken = req.headers.authorization?.split(" ")[1];
            if(!refreshToken){
                throw new UnauthorizationException(`Vui lòng cung cấp token để tiếp tục sử dụng`);
            }
        //req.headers[`x-access-token`]: key bên trong Object. do ký tự đặt biệt "-" nên "." ko được req.headers.x-access-token
        const accessToken = req.headers[`x-access-token`]
        if(!accessToken){
            throw new UnauthorizationException(`Vui lòng cung cấp token để tiếp tục sử dụng`);
        }

        const decodeRefeshToken =   jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

        const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
      
        if(decodeRefeshToken.userId !== decodeAccessToken.userId ){
            throw new UnauthorizationException(`Cặp Token không hợp lệ! `);
        }

        const userExists = await prisma.users.findUnique({
            where: {
                user_id: decodeRefeshToken.userId,
            },
         });
   
         if (!userExists) throw new UnauthorizationException(`User không tồn tại`);

        //create token
        const tokens = authService.createTokens(userExists.user_id )
        return tokens
     },
     
    getInfo: async (req) => {
        delete req.user.pass_word
        return req.user
    },
    //function
    createTokens: (user_id) => { 
        if(!user_id){
            throw new BadRequestException(`Không có userId để tạo token`)
        }
        // 1d: 1 ngày
        const accessToken = jwt.sign({userId: user_id},ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_EXPIRED});

        const refreshToken = jwt.sign({userId: user_id},REFRESH_TOKEN_SECRET,{expiresIn:REFRESH_TOKEN_EXPIRED});

        return {
            accessToken,
            refreshToken
        };
     }
    
}

export default authService