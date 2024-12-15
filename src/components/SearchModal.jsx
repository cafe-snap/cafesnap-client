import { useState } from "react";
import PropTypes from "prop-types";

const SearchModal = ({ cafeName, isModalHandler, searchHandler }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCafe, setSelectedCafe] = useState("");

  const handleSearch = () => {
    if ((selectedCafe === "") || (searchKeyword === "")) {
      alert("키워드 및 카페명을 재확인 해주세요");
    } else {
      searchHandler(searchKeyword, selectedCafe);
      isModalHandler();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-md w-96">
        <h2 className="text-white text-xl mb-4">검색</h2>
        <input
          type="text"
          placeholder="검색 키워드 입력"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="mb-4">
          <p className="font-medium mb-2">카페 선택:</p>
          <select
            value={selectedCafe}
            onChange={(e) => setSelectedCafe(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              카페를 선택하세요
            </option>
            {cafeName?.map((cafe) => (
              <option key={cafe} value={cafe}>
                {cafe}
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
          className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2"
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
