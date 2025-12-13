// lib/socket.ts
import { io, Socket } from 'socket.io-client'
import { cookie } from '@/lib/cookie'
import { COOKIES } from './utils'

let _socket: Socket | null = null

export function authSocket() {
    if (!_socket) {
        _socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
            autoConnect: false, // QUAN TRỌNG: tự tay connect khi đã có token
            withCredentials: true,
            transports: ['websocket'],
            // Mẹo: vẫn để dạng function để mỗi lần reconnect nó tự đọc cookie mới
            auth: (cb) => cb({ token: cookie.get(COOKIES.authentication) }),
        })

        // Log hỗ trợ debug
        _socket.on('connect', () => {
            console.log('[socket] connected', _socket!.id)
        })
        _socket.on('connect_error', (err) => {
            console.error('[socket] connect_error', err?.message || err)
        })
    }
    return _socket
}
