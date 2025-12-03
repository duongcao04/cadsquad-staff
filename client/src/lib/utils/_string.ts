/**
 * Removes Vietnamese diacritical marks (tones) from a string
 * and normalizes it for easier comparison or search.
 *
 * @param input - The Vietnamese text to process.
 * @returns A normalized string without diacritics and extra spaces.
 *
 * Example:
 * ```ts
 * removeVietnameseAccents("Tôi yêu Việt Nam") // "Toi yeu Viet Nam"
 * ```
 */
export function removeVietnameseAccents(input: string): string {
	return input
		.normalize('NFD')               // Split letters and diacritics
		.replace(/[\u0300-\u036f]/g, '') // Remove all diacritic marks
		.replace(/đ/g, 'd')              // Replace 'đ' with 'd'
		.replace(/Đ/g, 'D')              // Replace 'Đ' with 'D'
		.replace(/\s+/g, ' ')            // Replace multiple spaces with a single space
		.trim()                          // Remove leading/trailing whitespace
}

export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export function padToFourDigits(num: number | string): string {
	return num.toString().padStart(4, '0')
}

type PadDigitsOptions = { numberDigits?: number, redirect?: 'start' | 'end', charToPad?: string }
export function padDigits(value: number | string, options: PadDigitsOptions): string {
	const { numberDigits = 2, redirect = 'start', charToPad = '0' } = options
	if (redirect === 'start') {
		return value.toString().padStart(numberDigits, charToPad)
	} else {
		return value.toString().padEnd(numberDigits, charToPad)

	}
}

export const removeTrailingSlash = (url: string | undefined): string | undefined => {
	if (!url) return undefined;
	return url.replace(/\/$/, '');
};