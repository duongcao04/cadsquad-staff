import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export const SOCKET_URL = String(process.env.NEXT_PUBLIC_BACKEND_URL);

export const socket = io(SOCKET_URL);