import { create, StateCreator } from 'zustand';

interface BaseballSlice {
  myNumber: string | null;
  setMyNumber: (myNumber: string | null) => void;
}

const createBaseballSlice: StateCreator<BaseballSlice, [], [], BaseballSlice> = (set) => ({
  myNumber: null,
  setMyNumber: (myNumber) => set({ myNumber }),
});

interface BaseballStore extends BaseballSlice {}

export const baseballStore = create<BaseballStore>((...a) => ({
  ...createBaseballSlice(...a),
}));
