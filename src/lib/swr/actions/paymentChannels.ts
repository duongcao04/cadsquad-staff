import { JobType } from '@/validationSchemas/project.schema'

import { PAYMENT_CHANNEL_API } from '../api'

export const getPaymentChannels: () => Promise<JobType[]> = async () => {
    const res = await fetch(PAYMENT_CHANNEL_API, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data.records
}
