import { queryOptions } from "@tanstack/react-query";
import { IPaymentChannelResponse } from "../../../shared/interfaces";
import { TPaymentChannel } from "../../../shared/types";
import { paymentChannelApi } from "../../api";

export const mapPaymentChannel: (
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


export const paymentChannelsListOptions = () => {
	return queryOptions({
		queryKey: ['payment-channels'],
		queryFn: () => paymentChannelApi.findAll(),
		select: (res) => {
			const paymentChannelsData = res?.result
			return {
				paymentChannels: Array.isArray(paymentChannelsData)
					? paymentChannelsData.map(mapPaymentChannel)
					: []
			}
		},
	})
}