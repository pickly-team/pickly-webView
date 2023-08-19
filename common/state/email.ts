import { create } from 'zustand';

interface Email {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  initialize: () => void;
}

const useEmailStore = create<Email>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
  password: '',
  setPassword: (password) => set({ password }),
  initialize: () => set({ email: '', password: '' }),
}));

export default useEmailStore;
