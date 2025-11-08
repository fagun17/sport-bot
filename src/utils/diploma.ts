import fs from 'fs'
import path from 'path'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

export async function generateDiploma(athlete: {
	Фамилия: string
	Имя: string
	Регион: string
}): Promise<string> {
	const TEMPLATE_PATH = path.resolve('./src/template.pdf')
	const FONT_PATH = path.resolve('./src/assets/fonts/MetaPro-Bold.otf')
	const outPath = `./diploma_${athlete.Фамилия}_${athlete.Имя}.pdf`

	const pdfDoc = await PDFDocument.load(fs.readFileSync(TEMPLATE_PATH))
	pdfDoc.registerFontkit(fontkit)
	const font = await pdfDoc.embedFont(fs.readFileSync(FONT_PATH))

	const page = pdfDoc.getPage(0)
	const { height } = page.getSize()
	const fontSize = 24
	const centerX = 250

	const draw = (text: string, y: number, offsetX = 0) => {
		const width = font.widthOfTextAtSize(text, fontSize)
		page.drawText(text, {
			x: centerX - width / 2 + offsetX,
			y,
			size: fontSize,
			font,
			color: rgb(0, 0, 0),
		})
	}

	draw(athlete.Фамилия, height - 310)
	draw(athlete.Имя, height - 360)
	draw(athlete.Регион, height - 489, 6)

	fs.writeFileSync(outPath, await pdfDoc.save())
	return outPath
}
