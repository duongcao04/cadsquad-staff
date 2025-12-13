import { useEffect } from 'react'
import { cookie } from '@/lib/cookie'
import { authSocket } from '@/lib/socket'
import { COOKIES } from '../../lib/utils'

export function UseSocketOnBoot() {
    useEffect(() => {
        const token = cookie.get(COOKIES.authentication)
        if (!token) return
        const s = authSocket()
        s.auth = { token } // đảm bảo handshake có token mới nhất
        if (!s.connected) s.connect()
        return () => {
            // optional cleanup
        }
    }, [])
    return null
}
