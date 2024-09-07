const customerModel = require("../models/customerModel")
const logger = require("../utils/logger")

module.exports = async (ctx, next) => {
    if (ctx?.message?.text !== '/start') return next()

    const id = ctx.message.from.id 
    const username = ctx?.message?.from?.username

    const customer = await customerModel.findOne({id})
    if (customer) return next()

    logger.ans('userRegistrate', `Пользователь ${username ? username : id} не зарегистрирован`)

    ctx.scene.enter('WriteCustomerInfo')
}