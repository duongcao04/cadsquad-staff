import { PaymentChannel as PaymentChannelPrisma } from '@prisma/client'
import { Job } from './job.schema'

export type PaymentChannel = Partial<PaymentChannelPrisma> & {
    jobs?: Job[]
    _count: {
        jobs: number
    }
}
