'use client'

import { useQuery } from '@tanstack/react-query'
import { ApiResponse, axiosClient } from '@/lib/axios'
import { PaymentChannel } from '@/shared/interfaces/paymentChannel.interface'

export const usePaymentChannels = () => {
    return useQuery({
        queryKey: ['paymentChannels'],
        queryFn: () =>
            axiosClient.get<ApiResponse<PaymentChannel[]>>('payment-channels'),
        select: (res) => res.data.result,
    })
}
