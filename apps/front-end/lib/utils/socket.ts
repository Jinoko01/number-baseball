import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';

export function setSocket(accessToken: string): Socket {
  return io(`${API_BASE_URL}/chat`, {
    withCredentials: true,
    transports: ['websocket'],
    auth: { token: accessToken },
  });
}
