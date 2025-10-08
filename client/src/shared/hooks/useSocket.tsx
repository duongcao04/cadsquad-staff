import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export interface UseSocketOptions {
    token: string | null // JWT token
    serverUrl: string
}

export interface SocketEventHandler<T = unknown> {
    event: string
    callback: (data: T) => void
}

export const useSocket = ({ token, serverUrl }: UseSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    // Connect socket
    useEffect(() => {
        if (!token) return

        const newSocket = io(serverUrl, {
            auth: { token },
            transports: ['websocket'],
        })

        newSocket.on('connect', () =>
            console.log('Socket connected', newSocket.id)
        )
        newSocket.on('disconnect', () => console.log('Socket disconnected'))

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [token, serverUrl])

    /**
     * Subscribe to a socket event
     * @param event The event name
     * @param callback Function to call when event received
     */
    const onEvent = useCallback(
        <T = unknown,>(event: string, callback: (data: T) => void) => {
            socket?.on(event, callback)

            // Cleanup
            return () => {
                socket?.off(event, callback)
            }
        },
        [socket]
    )

    /**
     * Emit a socket event
     */
    const emitEvent = useCallback(
        (event: string, payload: unknown) => {
            socket?.emit(event, payload)
        },
        [socket]
    )

    return { socket, onEvent, emitEvent }
}
