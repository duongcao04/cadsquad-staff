import axios from 'axios'
import envConfig from '@/config/envConfig';

import { getCookie } from 'cookies-next';

export const BASE_URL = String(envConfig.NEXT_PUBLIC_API_ENDPOINT)

export const axiosClient = axios.create({
	baseURL: BASE_URL, // API endpoint url
	timeout: 5000, // Request timeout
	withCredentials: true, // Allow sending cookies
});

axiosClient.interceptors.request.use((config) => {
	// 1. Get token from cookie
	const token = getCookie("session")
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	// 2. If token -> put token into header for Authentication
	return config
}, (error) => {
	return Promise.reject(error)
})