import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export * from './_number'
export * from './_styles'
export * from './_string'
export * from './_constants'
export * from './_color'

dayjs.extend(utc)
dayjs.extend(timezone)

export const calcLeftTime = (endedDate: Date | string): number => {
	const now = dayjs()
	const end = dayjs.utc(endedDate).local() // hoặc .tz('Asia/Ho_Chi_Minh')
	return end.diff(now)
}

/**
 * Convert a sort query string (e.g. "-price,+createdAt") into an array of Prisma orderBy objects.
 */
export function parseSortParam(
	sort: string
): Record<string, 'asc' | 'desc'>[] {
	if (!sort) return []
	return sort
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
		.map((item) => {
			const direction = item.startsWith('-') ? 'desc' : 'asc'
			const field = item.replace(/^[-+]/, '')
			return { [field]: direction }
		})
}

export const handleCopy = (content: string, onSuccess?: () => void) => {
	if (content) {
		navigator.clipboard
			.writeText(content)
			.then(() => {
				onSuccess?.()
			})
			.catch((error) => {
				console.error('Error copying command', error)
			})
	}
}