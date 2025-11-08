import TelegramBot from 'node-telegram-bot-api'
import { findAthlete } from './utils/athlete.js'
import { generateDiploma } from './utils/diploma.js'
import fs from 'fs'
import { TOKEN } from './appsettings.js'

const bot = new TelegramBot(TOKEN, { polling: true })

bot.onText(/\/start/, msg => {
	bot.sendMessage(
		msg.chat.id,
		'👋 Привет! Чтобы получить диплом нажми кнопку 👇',
		{
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: [
					[{ text: '🎓 Получить диплом', callback_data: 'get_diploma' }],
				],
			},
		}
	)
})

bot.on('callback_query', async query => {
	const chatId = query.message?.chat.id
	if (!chatId) return

	if (query.data === 'get_diploma') {
		await bot.sendMessage(chatId, 'Введите фамилию, имя и регион спортсмена 📍')
	}
})

bot.on('message', async msg => {
	if (!msg.text || msg.text.startsWith('/')) return

	const athlete = findAthlete(msg.text)
	const chatId = msg.chat.id

	if (!athlete) {
		await bot.sendMessage(chatId, '❌ Спортсмен не найден.')
		return
	}

	await bot.sendMessage(chatId, '✅ Спортсмен найден. Генерируем диплом...')
	const pdfPath = await generateDiploma(athlete)
	await bot.sendDocument(chatId, pdfPath)
	fs.unlinkSync(pdfPath)
})

console.log('[BOT] Бот запущен 🚀')
