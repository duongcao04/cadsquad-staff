/**
 * Lightens a hex color by a specified percentage
 * @param hex - Hex color string (with or without #)
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color string
 */
export function lightenHexColor(hex: string, percent: number): string {
	// Remove # if present
	hex = hex.replace('#', '')

	// Validate hex color
	if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
		throw new Error('Invalid hex color format')
	}

	// Validate percent
	if (percent < 0 || percent > 100) {
		throw new Error('Percent must be between 0 and 100')
	}

	// Parse RGB components
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	// Calculate lightened values
	const lightenedR = Math.min(
		255,
		Math.round(r + (255 - r) * (percent / 100))
	)
	const lightenedG = Math.min(
		255,
		Math.round(g + (255 - g) * (percent / 100))
	)
	const lightenedB = Math.min(
		255,
		Math.round(b + (255 - b) * (percent / 100))
	)

	// Convert back to hex
	const toHex = (n: number) => n.toString(16).padStart(2, '0')

	return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`
}