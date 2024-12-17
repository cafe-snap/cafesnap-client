import PropTypes from "prop-types";
import { useState } from "react";
import engToKoHelper from "../utils/keywordHelper";

const SearchModal = ({ cafeName, isModalHandler, searchHandler }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCafe, setSelectedCafe] = useState("");
  const [transferKeyword, setTransferKeyword] = useState("");
  const [isEnglish, setIsEnglish] = useState(false);

  const handleSearch = () => {
    if ((selectedCafe === "") || (searchKeyword === "")) {
      alert("키워드 및 카페명을 재확인 해주세요");
    } else {
      searchHandler(searchKeyword, selectedCafe);
      isModalHandler();
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    const isEnglishOnly = /^[a-zA-Z\s]+$/.test(value);

    if (isEnglishOnly && value !== "") {
      setIsEnglish(true);
      setTransferKeyword(engToKoHelper(value));
    } else {
      setIsEnglish(false);
      setTransferKeyword("");
    }
  };

  const handleTransferConfirm = () => {
    setSearchKeyword(transferKeyword);
    setIsEnglish(false);
  };

  const handleTransferCancle = () => {
    setIsEnglish(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-md w-96">
        <h2 className="text-white text-xl mb-4">검색</h2>
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={handleKeywordChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        {isEnglish && (
          <div className="mb-4">
            <p className="text-green-300 mb-2">
              이걸 찾으시나요? =  <strong>{transferKeyword}</strong>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleTransferConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                예
              </button>
              <button
                onClick={handleTransferCancle}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                아니오
              </button>
            </div>
          </div>
        )}
        <div className="mb-4">
          <select
            value={selectedCafe}
            onChange={(e) => setSelectedCafe(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              카페를 선택하세요
            </option>
            {cafeName?.map((cafe, index) => (
              <option key={index} value={cafe.cafeName}>
                {cafe.cafeName}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          검색
        </button>
        <button
          onClick={isModalHandler}
          className="bg-red-600 text-white px-4 py-2 rounded-md ml-2"
        >
          취소
        </button>
      </div>
    </div>
  );
};

SearchModal.propTypes = {
  cafeName: PropTypes.array.isRequired,
  isModalHandler: PropTypes.func.isRequired,
  searchHandler: PropTypes.func.isRequired,
};

export default SearchModal;
