const { default: mongoose } = require("mongoose")
const logger = require("../utils/logger")

module.exports = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        logger.ok('connectDb', 'База данных успешно подключена')
    } catch (e) {
        logger.fatal('connectDb', 'Ошибка подключения БД')
        console.error(e)
    }
}