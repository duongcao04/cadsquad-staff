import { queryOptions } from '@tanstack/react-query'

import { IPaymentChannelResponse } from '../../../shared/interfaces'
import { TPaymentChannel } from '../../../shared/types'
import { paymentChannelApi } from '../../api'

export const mapPaymentChannel: (
    item?: IPaymentChannelResponse
) => TPaymentChannel = (item) => ({
    id: item?.id ?? 'N/A',
    displayName: item?.displayName ?? 'Unknown channel',
    jobs: item?.jobs ?? [],
    cardNumber: item?.cardNumber ?? null,
    hexColor: item?.hexColor ?? null,
    logoUrl: item?.logoUrl ?? null,
    ownerName: item?.ownerName ?? null,
})

export const paymentChannelsListOptions = () => {
    return queryOptions({
        queryKey: ['payment-channels'],
        queryFn: () => paymentChannelApi.findAll(),
        select: (res) => {
            const paymentChannelsData = res?.result
            return {
                paymentChannels: Array.isArray(paymentChannelsData)
                    ? paymentChannelsData.map(mapPaymentChannel)
                    : [],
            }
        },
    })
}
