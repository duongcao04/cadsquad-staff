export const appLocales = ['vi', 'en']

/**
 * Checks if a given locale is supported by the application.
 * @param {string} urlPath - The URL path, e.g., '/en/auth' or '/auth'.
 * @param {string[]} supportedLocales - An array of supported locale codes, e.g., ['en', 'vi', 'de'].
 * @returns {boolean} True if the locale in the URL is supported, otherwise false.
 */
export function isValidLocale(urlPath: string, supportedLocales: string[] = appLocales): boolean {
	// 1. Extract the locale from the URL path.
	// This regex looks for a two-letter locale code at the start of the path.
	const match = urlPath.match(/^\/([a-z]{2})\//);
	const urlLocale = match ? match[1] : '';

	// 2. Check if the extracted locale is in the supported list.
	return supportedLocales.includes(urlLocale);
}

// Function to remove the locale from the pathname
export function removeLocale(pathname: string): string {
	// Use the isValidLocale function to check for the presence of a locale
	const hasLocale = isValidLocale(pathname);

	if (hasLocale) {
		// If a locale is present, remove it using a regex that targets the /xx/ part
		return pathname.replace(/^\/[a-z]{2}/, '');
	}

	// If no locale is present, return the original pathname
	return pathname;
}
/**
 * Extracts the locale from the URL pathname if it is one of the supported app locales.
 * @param {string} pathname - The URL pathname (e.g., '/en/auth/login').
 * @param {string[]} supportedLocales - The array of supported locales (defaults to appLocales).
 * @returns {string | null} The extracted locale (e.g., 'en', 'vi') or null if not found/invalid.
 */
export function getLocale(pathname: string, supportedLocales: string[] = appLocales): string {
	// The regex looks for a two-letter locale code at the start of the path, followed by a slash.
	const match = pathname.match(/^\/([a-z]{2})\//);
	const urlLocale = match ? match[1] : null;

	// Check if the extracted locale exists and is in the supported list.
	if (urlLocale && supportedLocales.includes(urlLocale)) {
		return urlLocale;
	}

	// Return null if no valid locale prefix is found.
	return 'en';
}