import dotenv from 'dotenv'
dotenv.config()

const token = process.env.BOT_TOKEN
if (!token) {
	throw new Error('BOT_TOKEN is not defined in .env file')
}

export const TOKEN: string = token
