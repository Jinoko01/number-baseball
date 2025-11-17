import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';

let socket: Socket | null = null;

export function getSocket(accessToken: string): Socket {
  if (!socket) {
    socket = io(`${API_BASE_URL}/chat`, {
      withCredentials: true,
      transports: ['websocket'],
      auth: { token: accessToken },
    });
  }
  return socket;
}
