import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { CafeInfo } from "@/types/type";
import engToKoHelper from "../utils/keywordHelper";

interface SearchModalProps {
  cafeName: CafeInfo[];
  isModalHandler: () => void;
  searchHandler: (keyword: string, cafeName: string) => void;
}

const SearchModal = ({ cafeName, isModalHandler, searchHandler }: SearchModalProps) => {
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

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchKeyword, selectedCafe]);

  return (
    <div
      className="fixed h-[200px] inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={isModalHandler}
    >
      <div
        className="p-6 rounded-md w-96"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="text"
          placeholder="검색어 입력"
          value={searchKeyword}
          onChange={handleKeywordChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        {isEnglish && (
          <div className="mb-4">
            <button
              className="text-white font-bold mb-2"
              onClick={handleTransferConfirm}
            >
              이걸 찾으시나요? =  <strong>{transferKeyword}</strong>
            </button>
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
