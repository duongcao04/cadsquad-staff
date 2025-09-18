import dayjs from 'dayjs'

export const formatDate = (date: Date) => {
    const now = dayjs()
    const fileDate = dayjs(date)

    if (fileDate.isSame(now, 'day')) {
        return 'Today'
    } else if (fileDate.isSame(now.subtract(1, 'day'), 'day')) {
        return 'Yesterday'
    } else {
        return fileDate.format('MMM D, YYYY')
    }
}
