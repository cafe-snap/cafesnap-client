import { useEffect, useState } from "react";
import MediaModal from "../components/MediaModal";
import LoadingModal from "../components/LoadingModal";
import SearchModal from "../components/SearchModal";

const MainPage = () => {
  const [crowlingData, setCrowlingData] = useState(null);
  const [cafeName, setCafeName] = useState(null);
  const [selectName, setSelectName] = useState(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/crowling", {
      method: "post"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCrowlingData(data.mediaResource.message);
        } else {
          alert("크롤링 요청 실패");
        }
      })
      .catch((err) => {
        alert("크롤링 요청 실패" + err);
      });
  }, []);

  useEffect(() => {
    if (crowlingData !== null) {
      const infoKeys = Object.keys(crowlingData);
      setCafeName(infoKeys);
      setSelectName(infoKeys[0]);
    }
  }, [crowlingData]);

  const handleSelector = (e) => {
    setSelectName(e.target.value);
    setMediaIndex(0);
  };

  const handlePrev = () => {
    setMediaIndex((prev) =>
      prev === 0 ? crowlingData[selectName].length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setMediaIndex((prev) =>
      prev === crowlingData[selectName].length - 1 ? 0 : prev + 1
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
          type={crowlingData[selectName][mediaIndex]?.type}
          source={crowlingData[selectName][mediaIndex]?.src}
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
          {(selectName && crowlingData && crowlingData[selectName]?.[mediaIndex]) ? (
            <>
              <span className="block text-lg">{selectName}</span>
              <a
                href={crowlingData[selectName][mediaIndex]?.postLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-white underline"
              >
                {crowlingData[selectName][mediaIndex]?.postName}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
