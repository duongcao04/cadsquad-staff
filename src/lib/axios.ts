import axios from 'axios'
import envConfig from '@/config/envConfig';

export const BASE_URL = String(envConfig.NEXT_PUBLIC_API_ENDPOINT)

export const axiosClient = axios.create({
	baseURL: BASE_URL,
	timeout: 5000
});