import dayjs from 'dayjs'

export type TJobTab =
    | 'priority'
    | 'active'
    | 'completed'
    | 'delivered'
    | 'late'
    | 'cancelled'

export const getTabQuery = (tab: TJobTab | string) => {
    const today = dayjs().startOf('day').toDate()
    const dayAfterTomorrow = dayjs().add(2, 'day').startOf('day').toDate()

    const where: Record<string, unknown> = {
        deletedAt: null,
    }

    const priorityFilter = {
        ...where,
        dueAt: {
            gte: today,
            lt: dayAfterTomorrow, // trước ngày kia, tức là chỉ trong 2 ngày gần nhất (nay + mai)
        },
    }
    const activeFilter = where
    const completedFilter = {
        ...where,
        status: {
            is: {
                title: 'Completed',
            },
        },
    }
    const deliveredFilter = {
        ...where,
        status: {
            is: {
                title: 'Delivered',
            },
        },
    }
    const lateFilter = {
        ...where,
        AND: [
            {
                dueAt: {
                    lte: today,
                },
            },
            {
                status: {
                    NOT: {
                        title: 'Completed',
                    },
                },
            },
        ],
    }
    const cancelledFilter = {
        deletedAt: { not: null },
    }

    switch (tab) {
        case 'priority':
            return priorityFilter
        case 'active':
            return activeFilter
        case 'completed':
            return completedFilter
        case 'delivered':
            return deliveredFilter
        case 'late':
            return lateFilter
        case 'cancelled':
            return cancelledFilter
        default:
            return activeFilter
    }
}
