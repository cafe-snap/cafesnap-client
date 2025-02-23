import { useEffect, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import MediaModal from "../components/MediaModal";
import SearchModal from "../components/SearchModal";
import ErrorModal from "../components/ErrorModal";
import searchImg from "../asset/searchIcon.svg";
import useApiStore from "../store/useApiStore";

const MainPage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [selectedCafeMedia, setSelectedCafeMedia] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  const {
    fetchInitialApi,
    fetchMediaApi,
    fetchKeywordApi,
    fetchAdditinoApi,
    isSearchReady,
    isDataLoading,
    isErrorCount,
    cafeList,
    selectedCafe,
    crawlingDataCache,
    urlIndex,
    searchingData,
    setIsSearchReady,
    setSelectedCafe
  } = useApiStore();

  useEffect(() => {
    fetchInitialApi();
  }, []);

  useEffect(() => {
    if (cafeList && (currentIndex < cafeList.length)) {
      const nextFetch = cafeList.slice(currentIndex, currentIndex + 3);

      Promise.allSettled(nextFetch.map((cafeInfo) => fetchMediaApi(cafeInfo)))
        .then(() => {
          setCurrentIndex((prev) => prev + 3);
        })
        .catch((err) => console.error(err));
    }
  }, [cafeList, currentIndex]);

  useEffect(() => {
    if (selectedCafe && isDataLoading === false) {
      const newMedia = (Object.values(crawlingDataCache[selectedCafe])) || [];
      setSelectedCafeMedia(newMedia);
    }
  }, [selectedCafe, crawlingDataCache]);

  useEffect(() => {
    setShowFullTitle(false);
  }, [selectedCafeMedia, mediaIndex]);

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
      await fetchAdditinoApi(nextUrl, cafeInfo);
    }
  };

  const handleSearch = async (keyword, cafeName) => {
    const cafeInfo = cafeList.find((cafe) => cafe.cafeName === cafeName);
    setSearchKeyword(keyword);
    await fetchKeywordApi(keyword, cafeInfo);
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
    if ((touchStart - touchEnd) > 130) {
      handleNext();
    }

    if ((touchStart - touchEnd) < -130) {
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

  useEffect(() => {
    if (selectedCafeMedia.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedCafeMedia]);

  return (
    <div className="flex flex-col w-full h-screen bg-black overflow-hidden touch-pan-y">
      {isErrorCount && <ErrorModal />}
      <div
        className="items-center mt-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {(selectedCafeMedia.length === 0) ? (
          <LoadingModal />
        ) : (
          <MediaModal
            source={selectedCafeMedia[mediaIndex]?.src}
            totalMediaCount={selectedCafeMedia.length}
            currentMediaIndex={mediaIndex}
          />
        )}
      </div>

      <div className="flex flex-row mt-4 ml-8 gap-x-6 w-full">
        {(searchIsLoading && !isSearchReady) && (
          <div className="fixed top-4 w-4 h-4 rounded-full bg-gray-800 animate-bigBounce" />
        )}
        {isSearchReady && (
          <>
            <button
              onClick={handleSearchConfirm}
              className="fixed top-4 ml-12 text-white bg-black font-bold px-2 py-1"
            >
              {searchKeyword} 검색 결과가 도착했어요
            </button>
          </>
        )}

        {selectedCafeMedia.length === 0 ? null : (
          <>
            <div
              className="overflow-x-scroll no-scrollbar z-10"
              style={{ whiteSpace: "nowrap", overflowX: "visible" }}
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
                      opacity: hasData ? 1 : 0.2,
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

            {selectedCafeMedia[mediaIndex]?.postName && (
              <div className="shrink w-3/5 mt-2 text-gray-300 font-bold text-sm">
                {!showFullTitle ? (
                  <span
                    onClick={() => setShowFullTitle(true)}
                    className="block cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                    title={selectedCafeMedia[mediaIndex]?.postName}
                  >
                    {selectedCafeMedia[mediaIndex]?.postName}
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      setShowFullTitle(false);
                      window.open(
                        selectedCafeMedia[mediaIndex]?.postLink,
                        "_blank"
                      );
                    }}
                    className="block cursor-pointer"
                  >
                    {selectedCafeMedia[mediaIndex]?.postName}
                  </span>
                )}
              </div>
            )}

            {selectedCafeMedia.length !== 0 ? (
              <button
                className="fixed top-2 right-0 p-4"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <img src={searchImg} alt="search Icon" />
              </button>
            ) : null}
          </>
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
