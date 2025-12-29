import { EClientType } from '@/shared/enums'
import { IClientResponse } from '@/shared/interfaces'
import { TClient } from '@/shared/types'

export const mapClient: (item?: IClientResponse) => TClient = (item) => ({
    id: item?.id ?? 'N/A',
    code: item?.code ?? '',
    name: item?.name ?? 'Unknown user',
    address: item?.address ?? '',
    billingEmail: item?.billingEmail ?? 'unknown@unknown.email',
    country: item?.country ?? 'Unknown country',
    email: item?.email ?? 'unknown@unknown.email',
    currency: item?.currency ?? 'Dollar',
    jobs: item?.jobs ?? [],
    paymentTerms: item?.paymentTerms ?? '',
    phoneNumber: item?.phoneNumber ?? 'Unknown phone number',
    region: item?.region ?? 'Unknown region',
    taxId: item?.taxId ?? '',
    timezone: item?.timezone ?? 'Unknown timezone',
    type: item?.type ?? EClientType.INDIVIDUAL,
    createdAt: new Date(item?.createdAt ?? ''),
    updatedAt: new Date(item?.updatedAt ?? ''),
})
