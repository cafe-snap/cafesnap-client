import { useEffect, useState } from "react";
import MediaModal from "../components/MediaModal";
import LoadingModal from "../components/LoadingModal";

const MainPage = () => {
  const [initialCrawlingData, setInitialCrawlingData] = useState(null);
  const [cafeList, setCafeList] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [crawlingDataCache, setCrawlingDataCache] = useState({});

  useEffect(() => {
    const initialMediaRequest = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts/initial", {
          method: "post",
        });
        const data = await response.json();
        if (data.success) {
          const initialData = data.message.cafeUrlList[0]?.cafeName;
          setInitialCrawlingData(data.message.mediaResource);
          setCafeList(data.message.cafeUrlList);
          setSelectedCafe(initialData);
          setCrawlingDataCache({ [initialData]: data.message.mediaResource[initialData] });
        }
      } catch (err) {
        alert(`초기미디어 크롤링 요청 실패 = ${err}`);
      }
    };

    initialMediaRequest();
  }, []);

  const cafeMediaRequest = async (cafeInfo) => {
    try {
      const response = await fetch("http://localhost:3000/posts/selection", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cafeInfo),
      });
      const data = await response.json();
      if (data.success) {
        setCrawlingDataCache((prev) => ({
          ...prev,
          [cafeInfo.cafeName]: data.message,
        }));
      }
    } catch (err) {
      alert(`카페미디어 크롤링 요청 실패 = ${err}`);
    }
  };

  const selectedCafeMedia = selectedCafe ? (crawlingDataCache[selectedCafe] || initialCrawlingData?.[selectedCafe] || []) : [];

  const handlePrevious = () => {
    setMediaIndex((prevIndex) => (prevIndex > 0) ? prevIndex - 1 : prevIndex);
  };

  const handleNext = () => {
    setMediaIndex((prevIndex) => (prevIndex < selectedCafeMedia.length - 1) ? prevIndex + 1 : prevIndex);
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-black items-center justify-center">
      <div className="absolute top-4 left-4">
        <button
          className="bg-gray-800 p-2 rounded-full text-white"
        >
          🔍
        </button>
      </div>
      {(initialCrawlingData === null)? (
        <LoadingModal />
      ) : (
        <MediaModal
          type={selectedCafeMedia[mediaIndex]?.type}
          source={selectedCafeMedia[mediaIndex]?.src}
        />
      )}
      <div className="relative w-full flex flex-col items-center text-white mt-16">
        <div className="flex w-full justify-between px-10">
          <button
            onClick={handlePrevious}
            className="bg-gray-800 rounded-md px-4 py-2"
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
            className="bg-gray-800 rounded-md px-4 py-2"
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
