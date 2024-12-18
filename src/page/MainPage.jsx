import { useEffect, useState } from "react";
import LoadingModal from "../components/LoadingModal";
import MediaModal from "../components/MediaModal";
import SearchModal from "../components/SearchModal";

const MainPage = () => {
  const [cafeList, setCafeList] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [crawlingDataCache, setCrawlingDataCache] = useState({});
  const [selectedCafeMedia, setSelectedCafeMedia] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchingData, setSearchingData] = useState([]);
  const [isSearchReady, setIsSearchReady] = useState(false);
  const [urlIndex, setUrlIndex] = useState({});

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

  const keywordMediaRequest = async (keyword, cafeInfo) => {
    try {
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

  const handleSelectChange = async (e) => {
    const newCafe = e.target.value;
    setSelectedCafe(newCafe);
    setMediaIndex(0);
    const cafeInfo = cafeList.find((cafe) => cafe.cafeName === newCafe);

    if (!crawlingDataCache[newCafe]) {
      await cafeMediaRequest(cafeInfo);
    }
  };

  const handleSearch = async (keyword, cafeName) => {
    const cafeInfo = cafeList.find((cafe) => cafe.cafeName === cafeName);
    await keywordMediaRequest(keyword, cafeInfo);
  };

  const handleSearchConfirm = () => {
    setSelectedCafeMedia(Object.values(searchingData)[0]);
    setMediaIndex(0);
    setIsSearchReady(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black items-center justify-center">
      <div className="absolute top-4 left-4">
        {(selectedCafeMedia.length !== 0)? <button
          className="bg-green-500 p-2 rounded-full text-white"
          onClick={() => setIsSearchModalOpen(true)}
        >
          🔍
        </button> : null}
      </div>
      {isSearchModalOpen && (
        <SearchModal
          cafeName={cafeList}
          isModalHandler={() => setIsSearchModalOpen(false)}
          searchHandler={handleSearch}
        />
      )}
      {(selectedCafeMedia.length === 0)? (
        <LoadingModal />
      ) : (
        <MediaModal
          type={selectedCafeMedia[mediaIndex]?.type}
          source={selectedCafeMedia[mediaIndex]?.src}
        />
      )}
      {dataLoading ?
        <span className="flex mt-4 text-white">새로운 미디어 로딩중...</span> :
        null
      }
      {isSearchReady && (
        <>
          <span className="flex mt-4 text-white">🔍 검색 결과가 도착했습니다 🔍</span>
          <span className="flex mt-4 text-white">확인 버튼을 눌러 시청해주세요</span>
          <button
            onClick={handleSearchConfirm}
            className="ml-2 text-white bg-green-500 px-2 py-1 rounded-md"
          >
            확인
          </button>
        </>
      )}
      {selectedCafeMedia[mediaIndex]?.postName && (
        <a
          href={selectedCafeMedia[mediaIndex]?.postLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-gray-300 text-sm"
        >
          <strong>
            {selectedCafeMedia[mediaIndex]?.postName}
          </strong>
        </a>
      )}
      <div className="relative w-full flex flex-col items-center text-white mt-8">
        <div className="flex w-full justify-between px-10">
          <button
            onClick={handlePrevious}
            className="bg-green-500 rounded-md px-4 py-2"
            disabled={mediaIndex === 0}
          >
            이전
          </button>
          <select
            value={selectedCafe || ""}
            onChange={handleSelectChange}
            className="w-28 truncate bg-gray-800 text-white border border-gray-700 rounded-md px-2 py-1 text-sm"
          >
            {cafeList?.map((cafe, index) => (
              <option key={index} value={cafe.cafeName}>
                {cafe.cafeName}
              </option>
            ))}
          </select>
          <button
            onClick={handleNext}
            className="bg-green-500 rounded-md px-4 py-2"
            disabled={mediaIndex >= selectedCafeMedia.length - 1}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
