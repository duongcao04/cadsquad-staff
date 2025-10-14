// src/socket.ts
import { io } from "socket.io-client";
import { envConfig } from "../shared/config";
import getBrowserFingerprint from 'get-browser-fingerprint';

// Base WebSocket URL
export const SOCKET_URL = envConfig.NEXT_PUBLIC_WS_URL;

// 🔹 Public socket (no authentication)
export const socket = io(SOCKET_URL, {
	transports: ["websocket"],
});


const fingerprint = await getBrowserFingerprint();
// 🔹 Authenticated socket (token in handshake)
export const authSocket = (token: string) =>
	io(SOCKET_URL, {
		transports: ["websocket"],
		query: { token, deviceId: fingerprint }, // 👈 Attach token to handshake
	});