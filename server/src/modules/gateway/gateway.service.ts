import { Injectable, UseGuards } from '@nestjs/common'
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsJwtGuard } from '../auth/ws-jwt.guard'

@Injectable()
@WebSocketGateway({
	cors: [String(process.env.CLIENT_URL)],
})
@UseGuards(WsJwtGuard)
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server

	// Map<userId, socketIds[]>
	private activeUsers: Map<string, string[]> = new Map()

	handleConnection(client: Socket) {
		const userId = client.data?.user?.sub
		if (!userId) {
			// optional: disconnect if no user info
			client.disconnect(true)
			return
		}

		if (!this.activeUsers.has(userId)) this.activeUsers.set(userId, [])
		const userSockets = this.activeUsers.get(userId)
		if (userSockets) userSockets.push(client.id)

		// attach helper to client if you want (optional)
		client.data.connectedAt = Date.now()

		console.log(`User connected: ${userId} (socket: ${client.id})`)
	}

	handleDisconnect(client: Socket) {
		const userId = client.data?.user?.sub
		if (!userId) return

		const sockets = this.activeUsers.get(userId) || []
		this.activeUsers.set(userId, sockets.filter((id) => id !== client.id))

		// cleanup map entry if empty
		if ((this.activeUsers.get(userId) || []).length === 0) {
			this.activeUsers.delete(userId)
		}

		console.log(`User disconnected: ${userId} (socket: ${client.id})`)
	}

	/** Helper: get socket ids for a user */
	getUserSocketIds(userId: string): string[] {
		return this.activeUsers.get(userId) ?? []
	}

	/** Helper: emit to all sockets of a user */
	async emitToUser(userId: string, event: string, payload: any) {
		const socketIds = this.getUserSocketIds(userId)
		if (!socketIds.length) return false

		for (const id of socketIds) {
			const socket = this.server.sockets.sockets.get(id)
			if (socket) socket.emit(event, payload)
		}
		return true
	}

	/** Helper: emit to a single socket id (if needed) */
	emitToSocketId(socketId: string, event: string, payload: any) {
		const socket = this.server.sockets.sockets.get(socketId)
		if (socket) socket.emit(event, payload)
	}

	/** Helper: broadcast to everyone (or use server.emit directly) */
	broadcast(event: string, payload: any) {
		this.server.emit(event, payload)
	}

	/** Optional: check if a user is online */
	isUserOnline(userId: string): boolean {
		return (this.activeUsers.get(userId) ?? []).length > 0
	}
}
