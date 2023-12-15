import { create } from 'zustand';

interface useCategoryModalStore {
  isOpen: boolean;
  isEdit: boolean;
  editId?: string;
  onOpen: () => void;
  onEdit: (id: integer) => void;
  onClose: () => void;
}

export const useCategoryModal = create<useCategoryModalStore>((set) => ({
  isOpen: false,
  isEdit: false,
  editId: undefined,
  onOpen: () => set({ isOpen: true }),
  onEdit: (id: integer) => set({ isOpen: true, isEdit: true, editId: id }),
  onClose: () => set({ isOpen: false, isEdit: false, editId: undefined }),
}));
