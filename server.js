// console.log('hello world!')
import express from "express";
import { handleError } from "./src/common/helpers/error.helper.js";
import rootRouter from "./src/routes/root.router.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./src/common/prisma/init.prisma.js";
import initSocket from "./src/common/socket/init.socket.js";

// Tín hiệu từ client sau đó code sẽ chạy từ trên xuống dưới

// shift + alt + o: xóa đi import ko dùng cách tự động

const app = express();

//middleware để giúp phân giải data từ json sang object của javascript(Lưu ý: parsejson middleware phải nằm dưới express app và nắm trên tất cả endpoint)
// use: nhận tất cả api gọi vô để chạy tác vụ muốn quy định trước đó (path: để định nghĩa chạy cho api nào, nếu ko có mặc định tất cả)
app.use(express.json());
// app.use(cors())
app.use(cors({ origin: ["http://localhost:5173"] }));

//Định hình lại đường dẫn. Dấu "." định hình lại đúng đường dẫn folder. Nhớ gắn trc rootRouter
app.use(express.static("."))

// gắn rootRouter vào app
// app là localhost:3069 + use + routeRouter.videoRouter. =>localhost:3069/video/video-list
app.use(rootRouter);

// Thiết lập hết mọi thứ sau đó start server

//request: vào/nhận dl; response: ra/trả dl; next: middleware

// const cars = await sequelize.query(`SELECT * FROM cars`)
// console.log({cars})
// console.log(`cars-1`, cars[0])

// Code first
// Đi từ code tạo ra DB

// Database first
// Đi từ câu lệnh SQL để tạo ra table
// Cài thư viện sequelize-auto để đọc cấu trúc database để tạo model
// npx: giúp chạy câu lệnh trong cục bộ
// chạy câu lệnh sau dưới terminal
// - npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json
// additional.json để quy định timestamps là false(coi file additional.json)
//Lưu ý: Nếu thay đổi cấu trúc model thì chạy lại lệnh và nhớ chuyển module.export sang import và export. Bằng cách xóa tất cả model cũ chạy lại câu lệnh npx và nhớ thêm option thêm -l vào câu lệnh như sau:
// - npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm

// initModels thuộc file init-models.js coi export default
// const models = initModels(sequelize)
// app.get(`/video-list`, async (req, res, next) => {
//     const videos = await models.videos.findAll({raw:true})
//     res.json(videos)
// })

//inlay hint trong setting hiện gợi ý  biến app.listen(port: 3069,(first) => { second })
//tạo nhanh arrow function anfn
// callback funct sẽ đc tạo sau khi svr đã chạy lên xong
// có thể chạy bằng npm run start (start đc quy định bên package.json)

app.use(handleError);

//nên gắn const httpServer = createServer(app); trước listen
const httpServer = createServer(app);
// tạo server socket thông qua server app
// const io = new Server(httpServer, {
//   /* options */
// });

initSocket(httpServer)

// Lưu ý: IO là to nhất, socket là 01 client
// cứ 01 client FE kết nối đến BE sẽ tạo ra 1 object socket của riêng 1 kết nối phân biệt bằng id (socket là 1 object)
// io.on("connection", (socket) => {
//   // ...
//   // console.log(`id: ${socket.id}`);

//   socket.on("join-room", (data) => {
//     console.log({ data });
//     const { user_id_sender, user_id_recipient } = data;
//     // tạo roomID: sắp xếp 02 id lại với nhau (phải chung 1 quy tắc nhỏ lớn lớn sau hoặc ngược lại)
//     const roomId = [user_id_sender, user_id_recipient]
//       .sort((a, b) => a - b)
//       .join("_");
//     // console.log({roomId})
//     //Đảm bảo thoát hết room Trươc khi join room mới
//     socket.rooms.forEach((roomId) => {
//       socket.leave(roomId);
//     });
//     socket.join(roomId);
//   });

//   // nhận 2 thông số 1 tên event, 2 là callback funct
//   // data là dữ liệu client gửi lên
//   socket.on("send-message", async (data) => {
//     // console.log({data})
//     const { message, user_id_sender, user_id_recipient } = data;
//     const roomId = [user_id_sender, user_id_recipient]
//       .sort((a, b) => a - b)
//       .join("_");
//     // gửi cho phòng theo mô hình server phải gửi xuống mà server là IO
//     io.to(roomId).emit("receive-message", data);

//     await prisma.chats.create({
//       data: {
//         message: message,
//         user_id_sender: user_id_sender,
//         user_id_recipient: user_id_recipient,
//       },
//     });
//   });

//   socket.on("get-list-message", async (data) => {
//     const { user_id_sender, user_id_recipient } = data;
//     const chats = await prisma.chats.findMany({
//       where: {
//         OR: [
//           // lấy tin nhắn của mình
//           {
//             user_id_recipient: user_id_recipient,
//             user_id_sender: user_id_sender,
//           },
//           // lấy tin nhắn của đối phương
//           {
//             user_id_recipient: user_id_sender,
//             user_id_sender: user_id_recipient,
//           },
//         ],
//       },
//     });

//     // gửi 1 - 1 cho dù từ SVR tới client vẫn dùng socket. Khi nào gửi room thì dùng IO
//     socket.emit("get-list-message", chats);
//     // Nên lấy danh sách message khởi tọa bằng API. Không nên dùng bằng socket như phía trên
//   });
// });

//thay httpServer listen cho app
httpServer.listen(3069, () => {
  console.log(`Server Online At Port 3069`);
});
// app.listen(3069, () => {
//     console.log(`Server Online At Port 3069`)
// });

//cài ORM: sequelize từ npmjs.com (xác độ uy tín vào số lượng download hàng tuần, kiểm tra phiên bản có được update liên tục ko)
//  tìm bản cài Document -> Getting started

// //04 cách gửi DỮ LIỆU
// /*
// Query Parameters
// Thường dùng khi muốn phân trang và search, filter
// */
// app.get(`/query`, (request, response, next) => {

//     console.log(request.query);

//     const { email, password } = request.query;

//     console.log(email, password);

//     response.json(`Query Parameters`)
// });

// /*
// Path Parameters
// Thường dùng khi muốn lấy chi tiết hay detail của 1 user, 1 product v.v...
// */
// // Dùng nodemon để reload lại svr ko cần ctl+c và npm run start

// app.get(`/path/:id`, (request, response, next) => {
//     console.log(request.params);

//     const { id } = request.params;
//     console.log(id);
//     response.json(`Path Parameters`)
// });

// /*
// Headers
// Thường dùng khi
// */
// app.get(`/headers`, (request, response, next) => {
//     console.log(request.headers);

//     const { user } = request.headers;
//     console.log(user);

//     response.json(`Headers`)
// });

// /*
// Body
// Thường dùng khi
// để nhận dữ liệu từ body bắt buộc phải có
// - app.use(express.json())
// - hoặc sử dụng thư viện parser:
// */
// app.post(`/body`, (request, response, next) => {
//     console.log(request.body.Parse);

//     response.json(`Body`)
// });

// MIDDLEWARE
// app.use(`/`,(req, res, next) => { console.log(`middleware 1`);
//     // res.json(`oke middleware`)
//     //có next sẽ chạy tiếp bên dưới, ko có next sẽ bị treo lại do middle ko biết sẽ làm tác vụ gì tiếp theo

//     // cách truyền biến qua các middleware
//     const payload =`payload`
//     //tính chất của object. nếu thuộc tính có trươc đó thì ghi đè, nếu ko có sẽ tự thêm vào giống payload bên dưới
//     req.payload = payload
//     res.payload = payload
//     //truyền tham số vào next() thì sẽ nhảy xuống middle ware có error 4 tham số, skip 2 middle ware 2,3
//     next(123)
//  },
// (req, res, next) => { console.log(`middleware 2`);
//     console.log(req.payload)
//     console.log(res.payload)
//     next()
// },
// (req, res, next) => { console.log(`middleware 3`);
//     next()
// },
// //cả dự án chỉ nên có duy nhất 1 middleware 4 tham số
//     (err, req, res, next) => { console.log(`middleware bắt lỗi`);
//         console.log(err);
//         next()
//     }
// )

// PRISMA
// XÀI DB FIRST
// CLIENT = MODEL
// npx prisma init: khởi tạo prisma
// - tạo ra .env
// - tạo ra prisma/schema.prisma
// npx prisma db pull
// npx prisma generate
// * *** Cập nhật lại DB
//  *    prisma: chỉ cần chạy 2 câu lệnh sau:
//  *       npx prisma db pull
//  *       npx prisma generate
//  *
//  *    sequelize:
//  *       npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm
//  */

// console.log(process.env)

/**
 * tự động lưu token ở POSTMAN
 
const response = pm.response.json()

if(response.status === `error`) return

const accessToken = response.metaData.accessToken
const refreshToken = response.metaData.refreshToken

pm.globals.set("accessToken", accessToken);
pm.globals.set("refreshToken", refreshToken);

 */
