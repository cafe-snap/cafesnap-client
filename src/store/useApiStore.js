import { create } from "zustand";

const useApiStore = create((set) => ({
  isNavigate: false,

  fetchLoginApi: async () => {
    try {
      const response = await fetch("http://192.168.0.16:3000/login", {
        method: "post"
      });
      const data = await response.json();

      if (data.success) {
        set({ isNavigate: true });
      }
    } catch (err) {
      console.error(`${err} 로그인 요청 실패`);
    }
  },
}));

export default useApiStore;
