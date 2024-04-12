import { create } from 'zustand';

interface useActiveStoreInterface {
  id?: number;
  set: (id: number) => void;
  reset: () => void;
}

export const useActiveStore = create<useActiveStoreInterface>((set) => ({
  id: undefined,
  set: (id: number) => set({ id }),
  reset: () => set({ id: undefined }),
}));
