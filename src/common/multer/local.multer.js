
import multer from 'multer'
import path from 'path'

//Nơi lưu trữ (lưu buffer data hình ảnh) Xử lý tên file và đuôi mở rộng (extension)
const storage = multer.diskStorage({
    // Xử lý nơi lưu trữ file
    destination: function (req, file, cb) {
    //hỗ trợ cho thêm thông tin req và file để xử lý logic để tạo ra folder muốn lưu trữ (file: image, docx, excel, pdf)
      cb(null, 'images/')
    },

    //Xử lý tên file
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    //fileExtension đuôi mở rộng của file
      const fileExtension = path.extname(file.originalname)

    //   const fileNameString = `local-` + file.fieldname + '-' + uniqueSuffix + fileExtension
    const fileNameString = `local-${file.fieldname}-${uniqueSuffix}${fileExtension}`;

      cb(null, fileNameString)
    }
  })

//dest: folder mà mình muốn ảnh
// const uploadLocal = multer({ dest: 'images/' })
const uploadLocal = multer({ storage: storage })
//sau khi xử lý xong multer sẽ gắn file vào req. chỉ cần req.file là lấy dữ liệu đã được xử lý ra.
export default uploadLocal