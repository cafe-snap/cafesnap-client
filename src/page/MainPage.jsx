import { useEffect, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import MediaModal from "../components/MediaModal";
import SearchModal from "../components/SearchModal";

const MainPage = () => {
  const [cafeList, setCafeList] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearchReady, setIsSearchReady] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [crawlingDataCache, setCrawlingDataCache] = useState({});
  const [urlIndex, setUrlIndex] = useState({});
  const [selectedCafeMedia, setSelectedCafeMedia] = useState([]);
  const [searchingData, setSearchingData] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  useEffect(() => {
    const initialMediaRequest = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts/initial", {
          method: "post",
        });
        const data = await response.json();

        if (data.success) {
          const initialData = data.message.cafeUrlList[0]?.cafeName;
          setCafeList(data.message.cafeUrlList);
          setSelectedCafe(initialData);
          setCrawlingDataCache({ [initialData]: data.message.mediaResource[initialData] });
          setUrlIndex({ [initialData]: data.message.returnUrl });
        }
      } catch (err) {
        alert(`초기미디어 크롤링 요청 실패 = ${err}`);
      }
    };

    initialMediaRequest();
  }, []);

  const cafeMediaRequest = async (cafeInfo) => {
    setDataLoading(true);
    try {
      const response = await fetch("http://localhost:3000/posts/selection", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafeInfo),
      });
      const data = await response.json();

      if (data.success) {
        const newReturnUrl = data.message.returnUrl || "";
        setCrawlingDataCache((prev) => ({
          ...prev,
          [cafeInfo.cafeName]: data.message.mediaResource[cafeInfo.cafeName],
        }));
        setUrlIndex((prev) => ({
          ...prev,
          [cafeInfo.cafeName]: newReturnUrl,
        }));
      }
    } catch (err) {
      alert(`카페미디어 크롤링 요청 실패 = ${err}`);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (cafeList && (currentIndex < cafeList.length)) {
      const nextFetch = cafeList.slice(currentIndex, currentIndex + 3);

      Promise.all(nextFetch.map((cafeInfo) => cafeMediaRequest(cafeInfo)))
        .then(() => {
          setCurrentIndex((prev) => prev + 3);
        })
        .catch((err) => console.error(err));
    }
  }, [cafeList, currentIndex]);

  const keywordMediaRequest = async (keyword, cafeInfo) => {
    try {
      setSearchIsLoading(true);
      const response = await fetch("http://localhost:3000/posts/keyword", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, cafeInfo }),
      });
      const data = await response.json();

      if (data.success) {
        setSearchingData(data.message);
        setIsSearchReady(true);
      }
    } catch (err) {
      alert(`카페미디어 크롤링 요청 실패 = ${err}`);
    }
  };

  const extraCafeMediaRequest = async (nextUrl, cafeInfo) => {
    try {
      const response = await fetch("http://localhost:3000/posts/addition", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextUrl, cafeInfo }),
      });
      const data = await response.json();

      if (data.success) {
        const newMedia = data.message.mediaResource[cafeInfo.cafeName] || [];
        const newReturnUrl = data.message.returnUrl || "";
        setCrawlingDataCache((prev) => {
          const existingMedia = prev[cafeInfo.cafeName] || [];
          return {
            ...prev,
            [cafeInfo.cafeName]: [...existingMedia, ...newMedia],
          };
        });
        setUrlIndex((prev) => ({
          ...prev,
          [cafeInfo.cafeName]: newReturnUrl,
        }));
      }
    } catch (err) {
      alert(`카페미디어 크롤링 요청 실패 = ${err}`);
    }
  };

  useEffect(() => {
    if (selectedCafe && dataLoading === false) {
      const newMedia = (Object.values(crawlingDataCache[selectedCafe])) || [];
      setSelectedCafeMedia(newMedia);
    }
  }, [selectedCafe, crawlingDataCache]);

  const handlePrevious = () => {
    setMediaIndex((prevIndex) => (prevIndex > 0) ? prevIndex - 1 : prevIndex);
  };

  const handleNext = async () => {
    setMediaIndex((prevIndex) => (prevIndex < selectedCafeMedia.length - 1) ? prevIndex + 1 : prevIndex);
    const cafeInfo = cafeList.find((cafe) => cafe.cafeName === selectedCafe);

    if (mediaIndex === 1) {
      const postUrl = urlIndex[selectedCafe];
      let nextUrl = "";

      if (postUrl) {
        nextUrl = postUrl.replace(/(search\.page=)(\d+)/, (match, prefix, pageNum) => {
          const newPageNum = Number(pageNum) + 2;
          return `${prefix}${newPageNum}`;
        });
      }
      await extraCafeMediaRequest(nextUrl, cafeInfo);
    }
  };

  const handleSearch = async (keyword, cafeName) => {
    const cafeInfo = cafeList.find((cafe) => cafe.cafeName === cafeName);
    setSearchKeyword(keyword);
    await keywordMediaRequest(keyword, cafeInfo);
  };

  const handleSearchConfirm = () => {
    setSelectedCafeMedia(Object.values(searchingData)[0]);
    setMediaIndex(0);
    setIsSearchReady(false);
    setSearchIsLoading(false);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if ((touchStart - touchEnd) > 100) {
      handleNext();
    }

    if ((touchStart - touchEnd) < -100) {
      handlePrevious();
    }
  };

  const handleLogoClick = (cafeName) => {
    if (selectedCafe === cafeName) {
      setSelectedCafe(null);
    } else {
      setSelectedCafe(cafeName);
    }
  };

  return (
    <div
      className="flex flex-col w-full min-h-screen bg-black items-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(selectedCafeMedia.length === 0) ? (
        <LoadingModal />
      ) : (
        <MediaModal
          type={selectedCafeMedia[mediaIndex]?.type}
          source={selectedCafeMedia[mediaIndex]?.src}
        />
      )}
      <div className="flex flex-col items-center justify-center w-full mt-[420px]">
        {isSearchReady && (
          <>
            <span className="flex mt-2 text-white">🔍 검색 결과가 도착했습니다 🔍</span>
            <span className="flex mt-2 text-white">확인 버튼을 눌러 시청해 주세요</span>
            <button
              onClick={handleSearchConfirm}
              className="fixed top-4 ml-6 text-white bg-green-500 px-2 py-1 rounded-md"
            >
              {searchKeyword} 검색 결과가 도착했어요
            </button>
          </>
        )}
        {selectedCafeMedia.length === 0 ? null : (
          <div className="relative w-full">
            <div
              className="absolute mt-6 ml-6 w-full overflow-x-auto no-scrollbar z-10"
              style={{ whiteSpace: "nowrap" }}
            >
              {cafeList.map((cafe, index) => {
                const hasData = crawlingDataCache[cafe.cafeName] && crawlingDataCache[cafe.cafeName].length > 0;

                return (
                  <button
                    key={index}
                    className={`w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border-2 ${
                      selectedCafe === cafe.cafeName ? "border-green-500" : "border-gray-700"
                    } ${selectedCafe && selectedCafe !== cafe.cafeName ? "hidden" : ""}`}
                    onClick={() => handleLogoClick(cafe.cafeName)}
                    style={{
                      opacity: hasData ? 1 : 0.5,
                      pointerEvents: hasData ? "auto" : "none",
                    }}
                  >
                    <img
                      src={cafe.cafeLogo}
                      alt={cafe.cafeName}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
            <div className="relative flex flex-row items-center justify-center mt-4 ml-12 gap-x-4 w-full px-4">
              {selectedCafeMedia[mediaIndex]?.postName && (
                <a
                  href={selectedCafeMedia[mediaIndex]?.postLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink w-3/5 mt-2 text-gray-300 text-sm"
                >
                  <strong>{selectedCafeMedia[mediaIndex]?.postName}</strong>
                </a>
              )}
              {selectedCafeMedia.length !== 0 ? (
                <button
                  className="p-4 rounded-full text-white"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  🔍
                </button>
              ) : null}
            </div>
          </div>
        )}
        {isSearchModalOpen && (
          <SearchModal
            cafeName={cafeList}
            isModalHandler={() => setIsSearchModalOpen(false)}
            searchHandler={handleSearch}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;
