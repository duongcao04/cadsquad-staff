import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'

interface PhoneOutput {
    country: CountryCode | null
    formatted: string
}

export const phoneNumberFormatter = (rawPhone: string): PhoneOutput => {
    // 1. Handle empty or "garbage" inputs like "-" commonly seen in your image
    if (!rawPhone || rawPhone.trim() === '-' || rawPhone.trim().length < 2) {
        return { country: null, formatted: '-' }
    }

    try {
        // 2. Parse the number
        const phoneNumber = parsePhoneNumberFromString(rawPhone)

        if (phoneNumber && phoneNumber.isValid()) {
            return {
                country: phoneNumber.country || null, // e.g., 'VN', 'US'
                formatted: phoneNumber.formatInternational(), // e.g., '+84 862 248 ...'
            }
        }
    } catch (error) {
        // Silent fail for parsing errors
        console.log('Parse phone number fail', error)
    }

    // 3. Fallback: Return original string if we can't format it
    return { country: null, formatted: rawPhone }
}
