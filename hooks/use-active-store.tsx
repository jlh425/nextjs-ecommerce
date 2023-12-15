import { create } from 'zustand';

interface useActiveStoreInterface {
  id?: string;
  set: (id: integer) => void;
  reset: () => void;
}

export const useActiveStore = create<useActiveStoreInterface>((set) => ({
  id: undefined,
  set: (id: integer) => set({ id }),
  reset: () => set({ id: undefined }),
}));
