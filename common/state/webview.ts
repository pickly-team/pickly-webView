import { create } from 'zustand';

interface Webview {
  mode: 'DEFAUlT' | 'BOOKMARK';
  setMode: (mode: 'DEFAUlT' | 'BOOKMARK') => void;
  url: string;
  setUrl: (url: string) => void;
}

const webviewStore = create<Webview>((set) => ({
  mode: 'DEFAUlT',
  setMode: (mode) => set({ mode }),
  url: '',
  setUrl: (url) => set({ url }),
}));

export default webviewStore;
