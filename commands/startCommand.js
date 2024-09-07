const { Markup } = require('telegraf')

module.exports = (ctx) => {
    ctx.session.scene = {}
    ctx.session.__scenes = {}
    try { ctx.deleteMessage() } catch (e) {}
    ctx.reply(
        'Добро пожаловать в первый сервис по заказу такси в телеграм. Для заказа такси пришлите вашу геолокацию из телеграм.',
        Markup.inlineKeyboard([
            [ Markup.button.callback('Вызвать машину 🚕', 'user_order_taxi') ]
        ])
    )
}