import axios from 'axios'
import envConfig from '@/config/envConfig'

export const BASE_URL = String(envConfig.NEXT_PUBLIC_API_ENDPOINT)

import { cookie } from '@/lib/cookie'

export type ApiResponse<T> = {
    success: boolean
    message: string
    error?: string
    result?: T
    meta?: Record<string, unknown>
}

export const axiosClient = axios.create({
    baseURL: BASE_URL, // API endpoint url
    timeout: 5000, // Request timeout
    withCredentials: true, // Allow sending cookies
})

axiosClient.interceptors.request.use(
    (config) => {
        // 1. Get token from cookie
        const token = cookie.get('session')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // 2. If token -> put token into header for Authentication
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
