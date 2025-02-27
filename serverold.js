// console.log('hello world!')
import express from 'express';
import { DataTypes, Sequelize } from 'sequelize';
import initModels from './src/models/init-models.js';



const app = express();

//middleware để giúp phân giải data từ json sang object của javascript(Lưu ý: parsejson middleware phải nằm dưới express app và nắm trên tất cả endpoint)
app.use(express.json())
// Thiết lập hết mọi thứ sau đó start server

//request: vào/nhận dl; response: ra/trả dl; next: middleware
app.get(`/`, (request, response, next) => {
    console.log(`123`);



    response.json(`hello world`);

});

/*
Query Parameters
Thường dùng khi muốn phân trang và search, filter
*/
app.get(`/query`, (request, response, next) => {

    console.log(request.query);

    const { email, password } = request.query;

    console.log(email, password);

    response.json(`Query Parameters`)
});

/*
Path Parameters
Thường dùng khi muốn lấy chi tiết hay detail của 1 user, 1 product v.v...
*/
// Dùng nodemon để reload lại svr ko cần ctl+c và npm run start

app.get(`/path/:id`, (request, response, next) => {
    console.log(request.params);

    const { id } = request.params;
    console.log(id);
    response.json(`Path Parameters`)
});

/*
Headers 
Thường dùng khi 
*/
app.get(`/headers`, (request, response, next) => {
    console.log(request.headers);


    const { user } = request.headers;
    console.log(user);

    response.json(`Headers`)
});

/*
Body 
Thường dùng khi 
để nhận dữ liệu từ body bắt buộc phải có
- app.use(express.json())
- hoặc sử dụng thư viện parser: 
*/
app.post(`/body`, (request, response, next) => {
    console.log(request.body.Parse);

    response.json(`Body`)
});



const sequelize = new Sequelize('mysql://root:1234@localhost:3307/db_cyber_media')


//Kiểm tra kết nới với CSDL (db)
sequelize.authenticate().then(
    () => {
        console.log('Connection has been established successfully.')
    }
).catch(
    () => {
        console.error('Unable to connect to the database:', error)
    }
)


// const cars = await sequelize.query(`SELECT * FROM cars`)

// console.log({cars})
// console.log(`cars-1`, cars[0])




// Code first
// Đi từ code tạo ra DB
// Tạo ra model từ define
const Cars = sequelize.define('Cars', {
    car_id: {
        //nhấn ctrl + space để bật gợi ý
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT
    },
    passengers: {
        type: DataTypes.INTEGER
    },
    max_speed: {
        type: DataTypes.STRING
    },
    gearbox_type: {
        type: DataTypes.STRING
    },
    fuel_type: {
        type: DataTypes.STRING
    },
    price_per_day: {
        type: DataTypes.DOUBLE
    },
    discount_percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE,

    },
    updated_at: {
        type: DataTypes.DATE
    }
},
    {
        tableName: `cars`,
        //false để ko tự tạo 2 cột created_at và updated_at
        timestamps:false
    }
);

// tạo table(đồng bộ)
Cars.sync().then(
    () => { 
        console.log('Đồng bộ table cars thành công!')
     }
)
.catch(
    () => { 
        console.log('Đồng bộ table cars ko thành công!')
     }
)

app.get(`/cars`, async (req, res, next) => {
    //Đánh async ở function gần nhất đang bọc await
    // const cars = await sequelize.query(`SELECT * FROM cars`)
    const cars = await Cars.findAll({raw:true})

    console.log({cars})
    // console.log(`cars-1`, cars[0])
    
    // res.json(cars[0])
    res.json(cars)
})


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
const models = initModels(sequelize)
app.get(`/video-list`, async (req, res, next) => {
    const videos = await models.videos.findAll({raw:true})
    res.json(videos)
})



//inlay hint trong setting hiện gợi ý  biến app.listen(port: 3069,(first) => { second })
//tạo nhanh arrow function anfn
// callback funct sẽ đc tạo sau khi svr đã chạy lên xong
// có thể chạy bằng npm run start (start đc quy định bên package.json)
app.listen(3069, () => {
    console.log(`Server Online At Port 3069`)
});

//cài ORM: sequelize từ npmjs.com (xác độ uy tín vào số lượng download hàng tuần, kiểm tra phiên bản có được update liên tục ko)
//  tìm bản cài Document -> Getting started