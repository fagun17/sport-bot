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

	switch (query.data) {
		case 'get_diploma':
			await bot.sendMessage(
				chatId,
				'Введите фамилию, имя и регион спортсмена 📍'
			)
			break
		case 'restart':
			await bot.sendMessage(chatId, '👋 Хотите получить ещё диплом?', {
				reply_markup: {
					inline_keyboard: [
						[{ text: '🎓 Получить диплом', callback_data: 'get_diploma' }],
					],
				},
			})
			break
	}
})

bot.on('message', async msg => {
	if ((msg as any).via_bot) return

	if (msg.reply_to_message) return
	if (msg.edit_date) return
	if (!msg.text || msg.text.startsWith('/')) return

	const chatId = msg.chat.id
	const username =
		msg.from?.username || `${msg.from?.first_name} ${msg.from?.last_name || ''}`

	console.log(`[INPUT] User: ${username} (${chatId}) entered: ${msg.text}`)
	const athlete = findAthlete(msg.text)

	if (!athlete) {
		console.log(`[INFO] Спортсмен не найден: ${msg.text}`)
		await bot.sendMessage(
			chatId,
			'❌ Спортсмен не найден.\n\nЕсли вы уверены, что всё указали верно, напишите организаторам:',
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: '📩 Написать организаторам',
								url: 'https://t.me/eurasia_chat',
							},
						],
						[
							{
								text: '🎓 Попробовать снова',
								callback_data: 'get_diploma',
							},
						],
					],
				},
			}
		)
		return
	}

	await bot.sendMessage(chatId, '✅ Спортсмен найден. Генерируем диплом...')
	const pdfPath = await generateDiploma(athlete)
	await bot.sendDocument(chatId, pdfPath)
	fs.unlinkSync(pdfPath)

	await bot.sendMessage(chatId, '📨 Диплом отправлен!', {
		reply_markup: {
			inline_keyboard: [
				[{ text: '🎓 Получить ещё диплом', callback_data: 'get_diploma' }],
			],
		},
	})
})

console.log('[BOT] Бот запущен 🚀')
