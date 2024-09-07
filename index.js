require('dotenv').config()
const { Telegraf } = require('telegraf')
const LocalSession = require('telegraf-session-local')

const mainRouter = require('./routes/mainRouter')
const logger = require('./utils/logger')
const locationGettedCommand = require('./commands/locationGettedCommand')
const connectDb = require('./db/connectDb')
const botCommands = require('./botCommands')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use((new LocalSession({ database: 'session_telegraf.json' })).middleware())

bot.use(mainRouter)

bot.on('location', locationGettedCommand)

const start = async () => {
    console.clear()
    await connectDb()

    try {
        logger.ok('index', 'Бот успешно запущен')
        botCommands(bot)
        await bot.launch()
            .catch((e) => {logger.error('index', 'Ошибка работы бота'); console.error(e)})
    } catch (e) {
        process.once('SIGINT', () => bot.stop('SIGINT'))
        process.once('SIGTERM', () => bot.stop('SIGTERM'))
        start()
    }
}

start()

// Enable graceful stop

//1282086765
//i_rubinium