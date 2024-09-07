const { Scenes, Markup } = require("telegraf");
const customerModel = require("../models/customerModel");
const logger = require("../utils/logger");

module.exports = new Scenes.WizardScene(
    'WriteCustomerInfo',
    async (ctx) => {
        ctx.session.scene = { temp: 0, name: '', phone: '' }

        const message = 'Добро пожаловать в первого бота по заказу такси в телеграм. Для того что бы сделать Ваш первый заказ - вам нужно заполнить анкету пасажира.\n\nВведите ваше имя:'
        ctx.session.scene.temp = (await ctx.reply(message)).message_id

        ctx.wizard.next()
    },
    async (ctx) => {
        if (!ctx?.message?.text) return

        try { await ctx.deleteMessage() } catch (e) {}
        try { await ctx.deleteMessage(ctx.session.scene.temp) } catch (e) {}

        ctx.session.scene.name = ctx.message.text

        const message = `Приятно познакомится, ${ctx.message.text}!\n\nТеперь напечатайте ваш номер телефона начиная с +7.\n\nПример: +79991002020`
        ctx.session.scene.temp = (await ctx.reply(message)).message_id

        ctx.wizard.next()
    },
    async (ctx) => {
        if (!ctx?.message?.text) return

        const phone = ctx.message.text

        try { await ctx.deleteMessage() } catch (e) {}
        try { await ctx.deleteMessage(ctx.session.scene.temp) } catch (e) {}

        const isCorrect = phone.startsWith('+79') && phone.length === 12
        if (!isCorrect) {
            const tempMessage = (await ctx.reply('Кажется, вы указали номер в неправильном формате. Напомню пример: +79991002020')).message_id
            setTimeout(async () => { try { await ctx.deleteMessage(tempMessage) } catch (e) {} }, 2000)
            return
        }

        ctx.session.scene.phone = phone

        const { name } = ctx.session.scene
        const message = `Проверьте введенные данные:\n\n👤 ${name}\n📱 ${phone}\n\nВсе верно?`
        const keyboard = Markup.inlineKeyboard([[
            Markup.button.callback('Да, все верно', 'confirm_yes'), 
            Markup.button.callback('Заполнить заново', 'confirm_no')
        ]])

        ctx.reply(message, keyboard)

        ctx.wizard.next()
    },
    async (ctx) => {
        if (!ctx?.callbackQuery?.data) return

        const isConfirm = ctx.callbackQuery.data.endsWith('yes')
        if (!isConfirm) {
            try { await ctx.deleteMessage() } catch (e) {}
            ctx.session.scene.temp = (await ctx.reply('Отлично, давайте начнем знакомство сначала. Введите ваше имя:')).message_id
            return ctx.wizard.selectStep(1)
        }

        try { await ctx.deleteMessage() } catch (e) {}

        const { name, phone } = ctx.session.scene
        const { id, username } = ctx.callbackQuery.from

        await customerModel.create({ id, username, phone, name })

        ctx.reply('Отлично, вы успешно зарегистрировались, теперь вы можете вызвать такси!', Markup.inlineKeyboard([Markup.button.callback('Вызвать такси 🚕', 'user_order_taxi')]))

        logger.ans(`Пользователь ${username ? username : id} успешно зарегистрирован`)

        ctx.session.scene = {}
        ctx.scene.leave()
    }

)