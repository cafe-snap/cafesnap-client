import mainImg1 from "../asset/main1.png";
import mainImg2 from "../asset/main2.png";
import mainImg3 from "../asset/main3.png";
import searchImg from "../asset/search.png";
import { useState } from "react";

const LoadingModal = () => {
  const images = [
    { src: mainImg1, description: "해당 카페의 미디어를 즐겨보세요!" },
    { src: mainImg2, description: "다른 카페의 미디어도 확인해 보세요!" },
    { src: mainImg3, description: "원본 게시글을 확인해 보세요!" },
    { src: searchImg, description: "원하는 키워드의 미디어를 확인해 보세요!" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen flex flex-col justify-start items-center text-white text-5xl">
      <div className="relative h-20 py-5 mt-5">
        <div className="absolute w-4 h-4 rounded-full bg-green-600 animate-bigBounce" />
        <div className="text-white text-lg font-light align-text-top ml-8 tracking-widest">
          <strong>
            데이터를 불러오는 중입니다
          </strong>
          <br />
          <strong>
            약 1분 정도 소요됩니다
          </strong>
        </div>
      </div>

      <div className="flex flex-col mt-10 items-center">
        <img
          src={images[currentImageIndex].src}
          className="object-contain w-auto h-96 max-w-full border-2 border-green-800"
        />
        <p className="text-lg font-light mt-4">
          <strong>
            {images[currentImageIndex].description}
          </strong>
        </p>
      </div>

      <button
        onClick={handleNextImage}
        className="mt-4 px-2 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-800 transition"
      >
        계속
      </button>
    </div>
  );
};

export default LoadingModal;
