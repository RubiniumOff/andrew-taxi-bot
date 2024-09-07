const logger = require("../utils/logger")

module.exports = (ctx) => {
    const driver = 394199356
    const username = ctx.update.message.from?.username || ctx.update.message.from.id
    logger.ans('locationGettedCommand', `Клиент ${username} отправил геолокацию водителю ${driver}`)

    const { longitude, latitude } = ctx.update.message.location

    ctx.telegram.sendLocation(driver, latitude, longitude)
}