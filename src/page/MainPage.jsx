import { useEffect, useState } from "react";
import MediaModal from "../components/MediaModal";
import LoadingModal from "../components/LoadingModal";
import SearchModal from "../components/SearchModal";

const MainPage = () => {
  const [crawlingData, setCrawlingData] = useState(null);
  const [cafeName, setCafeName] = useState(null);
  const [selectName, setSelectName] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const crawlingRequest = async () => {
      try {
        const response = await fetch ("http://localhost:3000/posts", {
          method: "get",
        });
        const data = await response.json();

        if (data.success) {
          setCrawlingData(data.mediaResource.message);
        } else {
          alert(`크롤링 요청 실패 ${data.error}`);
        }
      } catch (err) {
        alert(`크롤링 요청 실패 = ${err}`);
      }
    };

    crawlingRequest();
  }, []);

  useEffect(() => {
    if (crawlingData !== null) {
      const infoKeys = Object.keys(crawlingData);
      setCafeName(infoKeys);
      setSelectName(infoKeys[0]);
    }
  }, [crawlingData]);

  const handleSelector = (e) => {
    setSelectName(e.target.value);
    setMediaIndex(0);
  };

  const handlePrev = () => {
    setMediaIndex((prev) =>
      prev === 0 ? crawlingData[selectName].length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setMediaIndex((prev) =>
      prev === crawlingData[selectName].length - 1 ? 0 : prev + 1
    );
  };

  const handleSearch = (keyword, selectedCafes) => {
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black items-center justify-center">
      <div className="absolute top-4 left-4">
        <button
          className="bg-gray-800 p-2 rounded-full text-white"
          onClick={() => setIsSearchModalOpen(true)}
        >
          🔍
        </button>
      </div>
      {isSearchModalOpen && (
        <SearchModal
          cafeName={cafeName}
          isModalHandler={() => setIsSearchModalOpen(false)}
          searchHandler={handleSearch}
        />
      )}
      {(selectName === null)? (
        <LoadingModal />
      ) : (
        <MediaModal
          type={crawlingData[selectName][mediaIndex]?.type}
          source={crawlingData[selectName][mediaIndex]?.src}
        />
      )}
      <div className="relative w-full flex flex-col items-center text-white mt-16">
        <div className="flex w-full justify-between px-10">
          <button className="bg-gray-800 rounded-md" onClick={handlePrev}>
            이전
          </button>
          {(cafeName === null) ? null : (
            <select
              onChange={handleSelector}
              value={selectName}
              className="w-28 truncate bg-gray-800 text-white border border-gray-700 rounded-md px-2 py-1 text-sm"
            >
              {cafeName.map((ele) => (
                <option value={ele} key={ele}>
                  {ele}
                </option>
              ))}
            </select>
          )}
          <button className="bg-gray-800 rounded-md" onClick={handleNext}>
            다음
          </button>
        </div>
        <div className="text-center mt-4">
          {(selectName && crawlingData && crawlingData[selectName]?.[mediaIndex]) ? (
            <>
              <span className="block text-lg">{selectName}</span>
              <a
                href={crawlingData[selectName][mediaIndex]?.postLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-white underline"
              >
                {crawlingData[selectName][mediaIndex]?.postName}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
