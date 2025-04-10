import { create } from "zustand";
import { MediaItem, CafeInfo } from "@/types/type";

type RetryFunction = (...args: any[]) => Promise<any>;

type SearchingData = Record<string, MediaItem[]>;

interface ApiResponse {
  success: boolean;
  message: {
    cafeUrlList: CafeInfo[];
    returnUrl: string | null;
    mediaResource: Record<string, string[]>;
  };
}

interface ApiStore {
  isNavigate: boolean;
  isDataLoading: boolean;
  isSearchReady: boolean;
  isErrorCount: boolean;
  cafeList: CafeInfo[] | null;
  selectedCafe: string | null;
  crawlingDataCache: Record<string, (string | object)[]>;
  urlIndex: { [key: string]: string };
  searchingData: SearchingData;
  setIsSearchReady: () => void;
  setSelectedCafe: (param: string) => void;
  resetErrorState: () => void;
  failedRequest: RetryFunction | null;
  fetchLoginApi: () => Promise<void>
  fetchInitialApi: () => Promise<void>
  fetchMediaApi: (cafeInfo: CafeInfo) => Promise<void>;
  fetchKeywordApi: (keyword: string, cafeInfo: CafeInfo) => Promise<void>;
  fetchAdditionApi: (nextUrl: string, cafeInfo: CafeInfo) => Promise<void>;
}

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retryCount: number = 0,
  set?: (fn: (state: ApiStore) => Partial<ApiStore>) => void,
  retryFunction?: RetryFunction
): Promise<ApiResponse | null> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`상태 코드: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`요청 실패 (시도 횟수: ${retryCount + 1})`, error);

    if (retryCount < 2) {
      return fetchWithRetry(url, options, retryCount + 1, set, retryFunction);
    } else {
      if (set && retryFunction) {
        set((state) => ({
          ...state,
          isErrorCount: true,
          failedRequest: retryFunction
        }));
      }
      return null;
    }
  }
};

const useApiStore = create<ApiStore>((set) => ({
  isNavigate: false,
  isDataLoading: true,
  isSearchReady: false,
  isErrorCount: false,
  failedRequest: null,
  cafeList: null,
  selectedCafe: null,
  crawlingDataCache: {},
  urlIndex: {},
  searchingData: {} as SearchingData,

  setIsSearchReady: () => {
    set({ isSearchReady: false });
  },

  setSelectedCafe: (param) => {
    set({ selectedCafe: param });
  },

  resetErrorState: () => {
    set({ isErrorCount: false, failedRequest: null });
  },

  fetchLoginApi: async () => {
    try {
      const data = await fetchWithRetry("http://172.30.1.19:3000/login", { method: "POST" });

      if (data?.success) {
        set({ isNavigate: true });
      }
    } catch (err) {
      console.error("로그인 요청 최종 실패", err);
    }
  },

  fetchInitialApi: async () => {
    try {
      const data = await fetchWithRetry("http://172.30.1.19:3000/posts/initial", { method: "POST" });

      if (data?.success) {
        const initialData = data.message.cafeUrlList[0]?.cafeName;
        set({
          cafeList: data.message.cafeUrlList,
          selectedCafe: initialData,
          crawlingDataCache: {
            [initialData]: data.message.mediaResource[initialData]
          },
          urlIndex: {
            [initialData]: data.message.returnUrl || ""
          },
          isDataLoading: false
        });
      }
    } catch (err) {
      console.error("초기 데이터 요청 최종 실패", err);
    }
  },

  fetchMediaApi: async (cafeInfo) => {
    try {
      const data = await fetchWithRetry("http://172.30.1.19:3000/posts/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafeInfo),
      });

      if (data?.success) {
        const newReturnUrl = data.message.returnUrl || "";
        set((state: ApiStore) => ({
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
    } catch (err) {
      console.error("미디어 요청 최종 실패", err);
    }
  },

  fetchKeywordApi: async (keyword, cafeInfo) => {
    try {
      const data = await fetchWithRetry("http://172.30.1.19:3000/posts/keyword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, cafeInfo }),
      });

      if (data?.success) {
        const parsed: SearchingData = {};

        for (const cafeName in data.message.mediaResource) {
          parsed[cafeName] = data.message.mediaResource[cafeName].map((url) => ({
            src: url
          }));
        }

        set({
          searchingData: parsed,
          isSearchReady: true
        });
      }
    } catch (err) {
      console.error("키워드 데이터 요청 최종 실패", err);
    }
  },

  fetchAdditionApi: async (nextUrl, cafeInfo) => {
    try {
      const data = await fetchWithRetry("http://172.30.1.19:3000/posts/addition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextUrl, cafeInfo }),
      });

      if (data?.success) {
        const newMedia = data.message.mediaResource[cafeInfo.cafeName] || [];
        const newReturnUrl = data.message.returnUrl || "";

        set((state: ApiStore) => ({
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
      console.error("추가 미디어 요청 최종 실패", err);
    }
  }
}));

export default useApiStore;
