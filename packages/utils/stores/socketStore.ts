import { create, StateCreator } from 'zustand';
import { Socket } from 'socket.io-client';

interface SocketSlice {
  socketClient: Socket | null;
  setSocketClient: (socketClient: Socket | null) => void;
}

const createSocketSlice: StateCreator<SocketSlice, [], [], SocketSlice> = (set) => ({
  socketClient: null,
  setSocketClient: (socketClient) => set({ socketClient }),
});

interface SocketStore extends SocketSlice {}

export const useSocketStore = create<SocketStore>((...a) => ({
  ...createSocketSlice(...a),
}));
