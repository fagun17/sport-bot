import { loadAthletes } from './excel.js'

const athletes = loadAthletes()
console.log(`[OK] Загружено ${athletes.length} спортсменов из Excel`)

export function findAthlete(input: string) {
	const cleaned = input.replace(',', ' ').replace(/\s+/g, ' ').trim()
	const parts = cleaned.split(' ')
	if (parts.length < 3) return null

	const [lastName, firstName, ...regionParts] = parts
	const region = regionParts.join(' ')

	return athletes.find(
		a =>
			a.Фамилия.toLowerCase() === lastName.toLowerCase() &&
			a.Имя.toLowerCase() === firstName.toLowerCase() &&
			a.Регион.toLowerCase() === region.toLowerCase()
	)
}
