
import { Sequelize } from 'sequelize';
import initModels from '../../models/init-models.js';
import { DATABASE_URL } from '../constant/app.constant.js';

//export lẻ
export const sequelize = new Sequelize(DATABASE_URL,{logging:false})

// option "logging" để tắt dòng log bên dưới khi npm run start
// Executing (default): SELECT 1+1 AS result
// Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'cars' AND TABLE_SCHEMA = 'db_cyber_media'
// Connection has been established successfully.
// Executing (default): SHOW INDEX FROM `cars`

const models = initModels(sequelize);

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

export default models