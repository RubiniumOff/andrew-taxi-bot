const { Scenes, Markup } = require("telegraf");

// TODO Логика 
/* 
    Когда клиент нажимает кнопку "вызвать машину":
    - Выводим сообщение с вводом адреса или геолокации [x]
    - Спрашиваем не хочет ли увеличить стоимость поездки [x]
    - Отправляем сообщение свободной машине []
    - Заствляем клиента ожидать []
*/

module.exports = new Scenes.WizardScene(
    'UserOrderTaxi',
    async (ctx) => {
        ctx.session.scene = {
            coords: {},
            isCoords: false,
            address: '',
            temp: 0
        }
        ctx.session.scene.temp = (await ctx.reply('Введите адрес, куда приехать машине, например: "Пушкина, 23а п.2"')).message_id
        try { ctx.deleteMessage() } catch (e) {}
        ctx.wizard.next()
    },
    (ctx) => {
        const isLocation = ctx?.update?.message?.location
        const isText = ctx?.message?.text

        const keyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Нет, спасибо', 'up_cost-no')],
            [
                Markup.button.callback('+20₽', 'up_cost-20'),
                Markup.button.callback('+40₽', 'up_cost-40'),
                Markup.button.callback('+60₽', 'up_cost-60'),
                Markup.button.callback('+100₽', 'up_cost-100'),
            ]
        ])

        try { ctx.deleteMessage() } catch (e) {}
        try { ctx.deleteMessage(ctx.session.scene.temp) } catch (e) {}

        if (isLocation) {
            const {latitude, longitude} = ctx.update.message.location
            ctx.reply(`Отлично! Я записал координаты. Не хотите ли вы ускорить подачу машины увеличив стоимость?`, keyboard)
            ctx.session.scene.coords = { latitude, longitude }
            ctx.session.scene.isCoords = true
        } 

        if (isText) {
            ctx.reply(`Отлично! Я записал адрес. Не хотите ли вы ускорить подачу машины увеличив стоимость?`, keyboard)
            ctx.session.scene.address = ctx.message.text
            ctx.session.scene.isCoords = false
        }

        ctx.wizard.next()
    },
    async (ctx) => {
        const upCost = ctx.callbackQuery.data.split('-')[1]
        const isUpCost = upCost !== 'no'

        const keyboardCoords = Markup.inlineKeyboard([[
            Markup.button.callback('Да, вызывайте', 'order_confirm-yes'),
            Markup.button.callback('Нет, отмена', 'order_confirm-no')
        ]])

        const upCostText = isUpCost ? `Вы повысили стоимость на ${upCost}₽` : 'Вы выбрали не повышать стоимость'

        let message = ''

        if (ctx.session.scene.isCoords) message = `${upCostText}\n\nПодтвердите заказ такси`
        else message = `${upCostText}\n\nПроверьте данные адрес:\n${ctx.session.scene.address}`

        try { ctx.deleteMessage() } catch (e) {}
        ctx.session.scene.temp = (await ctx.reply(message, keyboardCoords)).message_id

        ctx.wizard.next()
    }, 
    async (ctx) => {
        const order_confirm = ctx?.callbackQuery?.data || null

        if (!order_confirm) {
            const tempMessage = await ctx.reply('Пожалуйста, ипользуйте кнопки под сообщением выше. Сообщение будет удалено')
            setTimeout(() => { 
                try { ctx.deleteMessage(tempMessage.message_id) } catch (e) {}
                try { ctx.deleteMessage() } catch (e) {}
            }, 3000)
            return
        }

        try { ctx.deleteMessage() } catch (e) {}
        
        const isConfirm = order_confirm.endsWith('yes')
        if (!isConfirm) {
            ctx.scene.leave()
            ctx.session.scene = {}
            return ctx.reply('Данный заказ был отменен. Для продолжения введите /start')
        }

        ctx.reply('Заявка составлена, ожидайте водителя', Markup.inlineKeyboard([Markup.button.callback('Отменить заказ', 'order_cancel')]))
    }

    // "order_confirm-yes".split('-') -> [order_confirm, yes]
    // "order_confirm-yes".endsWith('yes') //true ! false
)