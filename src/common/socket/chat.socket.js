import { prisma } from "../prisma/init.prisma.js";

const handleChatSocket = (io, socket) => {
  socket.on("join-room", (data) => {
    console.log({ data });
    const { user_id_sender, user_id_recipient } = data;
    // tạo roomID: sắp xếp 02 id lại với nhau (phải chung 1 quy tắc nhỏ lớn lớn sau hoặc ngược lại)
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");
    // console.log({roomId})
    //Đảm bảo thoát hết room Trươc khi join room mới
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
    socket.join(roomId);
  });

  // nhận 2 thông số 1 tên event, 2 là callback funct
  // data là dữ liệu client gửi lên
  socket.on("send-message", async (data) => {
    // console.log({data})
    const { message, user_id_sender, user_id_recipient } = data;
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");
    // gửi cho phòng theo mô hình server phải gửi xuống mà server là IO
    io.to(roomId).emit("receive-message", data);

    await prisma.chats.create({
      data: {
        message: message,
        user_id_sender: user_id_sender,
        user_id_recipient: user_id_recipient,
      },
    });
  });

  socket.on("get-list-message", async (data) => {
    const { user_id_sender, user_id_recipient } = data;
    const chats = await prisma.chats.findMany({
      where: {
        OR: [
          // lấy tin nhắn của mình
          {
            user_id_recipient: user_id_recipient,
            user_id_sender: user_id_sender,
          },
          // lấy tin nhắn của đối phương
          {
            user_id_recipient: user_id_sender,
            user_id_sender: user_id_recipient,
          },
        ],
      },
    });

    // gửi 1 - 1 cho dù từ SVR tới client vẫn dùng socket. Khi nào gửi room thì dùng IO
    socket.emit("get-list-message", chats);
    // Nên lấy danh sách message khởi tọa bằng API. Không nên dùng bằng socket như phía trên
  });
};

export default handleChatSocket;
