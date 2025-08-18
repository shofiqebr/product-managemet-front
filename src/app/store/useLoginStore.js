// store/useLoginStore.js
import { create } from "zustand";

const useLoginStore = create((set) => ({
  loginInfo: null,
  setLoginInfo: (info) => set({ loginInfo: info }),
  clearLoginInfo: () => set({ loginInfo: null }),
}));

export default useLoginStore;
