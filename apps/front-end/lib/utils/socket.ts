import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../constants/api';

interface SetSocketParameter {
  path: string;
  accessToken: string;
}

export function setSocket({ path, accessToken }: SetSocketParameter): Socket {
  return io(`${API_BASE_URL}${path}`, {
    withCredentials: true,
    transports: ['websocket'],
    auth: { token: accessToken },
    reconnectionAttempts: 5,
  });
}
