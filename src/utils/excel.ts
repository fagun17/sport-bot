import XLSX from 'xlsx'
import path from 'path'

export function loadAthletes(): {
	Фамилия: string
	Имя: string
	Регион: string
}[] {
	const EXCEL_PATH = path.resolve('./src/athletes.xlsx')
	const workbook = XLSX.readFile(EXCEL_PATH)
	const sheet = workbook.Sheets['СПИСОК СПОРТСМЕНОВ']
	const athletesRaw: any[] = XLSX.utils.sheet_to_json(sheet)

	return athletesRaw
		.map(a => ({
			Фамилия: (a['Фамилия'] ?? '')
				.toString()
				.trim()
				.replace(/\u00A0/g, ''),
			Имя: (a['Имя'] ?? '')
				.toString()
				.trim()
				.replace(/\u00A0/g, ''),
			Регион: (a['Регион'] ?? '')
				.toString()
				.trim()
				.replace(/\u00A0/g, ''),
		}))
		.filter(a => a.Фамилия && a.Имя && a.Регион)
}
