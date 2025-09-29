'use client'

import { useQuery } from '@tanstack/react-query'
import { paymentChannelApi } from '@/app/api/paymentChannel.api'

export const usePaymentChannels = () => {
    return useQuery({
        queryKey: ['paymentChannels'],
        queryFn: () => paymentChannelApi.findAll(),
        select: (res) => res.data.result,
    })
}
