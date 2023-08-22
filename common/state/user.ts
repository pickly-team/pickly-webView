import { create } from 'zustand';

interface User {
  name: string;
  setName: (name: string) => void;
}

const useUserStore = create<User>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}));

export default useUserStore;
