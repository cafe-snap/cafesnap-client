import { create } from "zustand";

const useApiStore = create((set) => ({
  isNavigate: false,
  isDataLoading: true,
  isSearchReady: false,
  cafeList: null,
  selectedCafe: null,
  crawlingDataCache: {},
  urlIndex: {},
  searchingData: [],

  setIsSearchReady: () => {
    set({ isSearchReady: false });
  },

  setSelectedCafe: (param) => {
    set({ selectedCafe: param });
  },

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

  fetchInitialApi: async () => {
    try{
      const response = await fetch("http://192.168.0.16:3000/posts/initial", {
        method: "post"
      });
      const data = await response.json();

      if (data.success) {
        const initialData = data.message.cafeUrlList[0]?.cafeName;
        set({
          cafeList: data.message.cafeUrlList,
          selectedCafe: initialData,
          crawlingDataCache: {
            [initialData] : data.message.mediaResource[initialData]
          },
          urlIndex: {
            [initialData]: data.message.returnUrl
          },
          isDataLoading: false
        });
      }
    } catch(err) {
      console.error(`${err} 초기 데이터 요청 에러 발생`);
    }
  },

  fetchMediaApi: async (cafeInfo) => {
    try{
      const response = await fetch("http://192.168.0.16:3000/posts/selection", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafeInfo),
      });
      const data = await response.json();

      if (data.success) {
        const newReturnUrl = data.message.returnUrl || "";
        set((state) => ({
          crawlingDataCache: {
            ...state.crawlingDataCache,
            [cafeInfo.cafeName]: data.message.mediaResource[cafeInfo.cafeName],
          },
          urlIndex: {
            ...state.urlIndex,
            [cafeInfo.cafeName]: newReturnUrl,
          }
        }));
      }
    } catch(err) {
      console.error(`${err} 나머지 데이터 요청 에러 발생`);
    }
  },

  fetchKeywordApi: async (keyword, cafeInfo) => {
    try{
      const response = await fetch("http://192.168.0.16:3000/posts/keyword", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, cafeInfo }),
      });
      const data = await response.json();

      if (data.success) {
        set({
          searchingData: data.message,
          isSearchReady: true
        });
      }
    } catch(err) {
      console.error(`${err} 키워드 데이터 요청 에러 발생`);
    }
  },

  fetchAdditinoApi: async (nextUrl, cafeInfo) => {
    try {
      const response = await fetch("http://192.168.0.16:3000/posts/addition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextUrl, cafeInfo }),
      });
      const data = await response.json();

      if (data.success) {
        const newMedia = data.message.mediaResource[cafeInfo.cafeName] || [];
        const newReturnUrl = data.message.returnUrl || "";

        set((state) => ({
          crawlingDataCache: {
            ...state.crawlingDataCache,
            [cafeInfo.cafeName]: [
              ...(state.crawlingDataCache[cafeInfo.cafeName] || []),
              ...newMedia,
            ],
          },
          urlIndex: {
            ...state.urlIndex,
            [cafeInfo.cafeName]: newReturnUrl,
          }
        }));
      }
    } catch (err) {
      console.error(`${err} 추가 미디어 요청 에러 발생`);
    }
  }
}));

export default useApiStore;
