import { create, StateCreator } from 'zustand';

interface AuthSlice {
  id: string | null;
  setId: (githubId: string | null) => void;
  avatar: string | null;
  setAvatar: (avatar: string | null) => void;
  name: string | null;
  setName: (name: string | null) => void;
}

const createGithubAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  id: null,
  setId: (githubId) => set({ id: githubId }),
  avatar: null,
  setAvatar: (avatar) => set({ avatar }),
  name: null,
  setName: (name) => set({ name }),
});

interface AuthStore extends AuthSlice {}

const useAuthStore = create<AuthStore>((...a) => ({
  ...createGithubAuthSlice(...a),
}));

export default useAuthStore;
