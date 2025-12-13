'use client'

import { paymentChannelApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { IPaymentChannelResponse } from '../../shared/interfaces'
import { TPaymentChannel } from '../../shared/types'

export const mapPaymentChannels: (
    item: IPaymentChannelResponse
) => TPaymentChannel = (item) => ({
    id: item.id,
    displayName: item.displayName ?? '',
    jobs: item.jobs ?? [],
    cardNumber: item.cardNumber ?? '',
    hexColor: item.hexColor ?? '',
    logoUrl: item.logoUrl ?? '',
    ownerName: item.ownerName ?? '',
})

export const usePaymentChannels = () => {
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['paymentChannels'],
        queryFn: () => paymentChannelApi.findAll(),
        select: (res) => res.data.result,
    })
    const paymentChannels = useMemo(() => {
        const paymentChannelsData = data

        if (!Array.isArray(paymentChannelsData)) {
            return []
        }

        return paymentChannelsData.map((item) => mapPaymentChannels(item))
    }, [data])

    return {
        data: paymentChannels,
        isLoading: isLoading || isFetching,
    }
}
