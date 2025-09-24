import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export const DATE_FORMAT = 'DD/MM/YYYY'

type Options = {
	format: string
	timezone: string
}
export const VietnamDateFormat = (value: string | Date, options: Options = {
	format: DATE_FORMAT,
	timezone: 'Asia/Ho_Chi_Minh'
}) => {
	return dayjs
		.utc(value)
		.tz(options.timezone)
		.format(options.format)
}