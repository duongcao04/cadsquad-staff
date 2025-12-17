import { ApiResponse, axiosClient } from "../axios"
import { envConfig } from "../config"

interface IAblyResponse {
	keyName: string
	clientId: string
	timestamp: number | string
	nonce: string
	mac: string
}

export const ablyApi = {
	authUrl: '/v1/ably/auth',
	auth: async (token: string) => {
		return axiosClient
			.get<ApiResponse<IAblyResponse>>(
				'/v1/ably/auth',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				const data = res.data.result
				console.log(data);
				return data

			})
	},
}