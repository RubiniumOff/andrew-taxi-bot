module.exports = async (bot) => {
	await bot.telegram.setMyCommands([
		{ command: "start", description: "Главное меню бота"}
	])
}