const { Composer, Scenes } = require("telegraf");
const bot = new Composer()

const UserOrderTaxi = require("../scenes/UserOrderTaxi");
const WriteCustomerInfo = require("../scenes/WriteCustomerInfo");
const userRegistrate = require("../middlewares/userRegistrate");
const startCommand = require('../commands/startCommand')

const stage = new Scenes.Stage([
    UserOrderTaxi,
    WriteCustomerInfo
])

bot.use(stage.middleware())

bot.use(userRegistrate) // Миддлуха для регистрации !! В НАЧАЛЕ !!

bot.start(startCommand) // Стартовая комадна для отчиски session

bot.action('user_order_taxi', Scenes.Stage.enter('UserOrderTaxi'))

module.exports = bot