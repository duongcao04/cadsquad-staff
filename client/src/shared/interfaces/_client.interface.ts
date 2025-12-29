import { EClientType } from '../enums'
import { TJob } from '../types'

export interface IClientResponse {
    id?: string
    name?: string
    code?: string
    type?: EClientType
    region?: string
    country?: string
    address?: string
    timezone?: string
    email?: string
    phoneNumber?: string
    billingEmail?: string
    taxId?: string
    currency?: string
    paymentTerms?: string
    jobs?: TJob[]
    createdAt?: Date | string
    updatedAt?: Date | string
}
