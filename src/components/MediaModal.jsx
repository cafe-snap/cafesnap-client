import PropTypes from "prop-types";
import { useState } from "react";

const MediaModal = ({ source, totalMediaCount, currentMediaIndex }) => {
  const [isShowControl, setIsShowControl] = useState(false);

  const toggleControl = () => {
    setIsShowControl((prev) => !prev);
  };

  return (
    <div
      className="flex flex-col mt-10 w-full h-[400px] justify-center items-center bg-black overflow-hidden"
      onClick={toggleControl}
    >
      <div className="relative w-full h-2 z-10">
        {Array.from({ length: totalMediaCount }).map((_, index) => (
          <div
            key={index}
            className={`absolute h-full transition-all ${
              index <= currentMediaIndex ? "bg-green-500" : "bg-black"
            }`}
            style={{
              width: `${100 / totalMediaCount}%`,
              left: `${(100 / totalMediaCount) * index}%`,
            }}
          ></div>
        ))}
      </div>
      <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
        <video
          className="object-contain max-h-[90%] w-auto h-auto"
          src={source}
          autoPlay
          playsInline
          controls={isShowControl}
          muted
        />
      </div>
    </div>
  );
};

MediaModal.propTypes = {
  source: PropTypes.string.isRequired,
  totalMediaCount: PropTypes.number.isRequired,
  currentMediaIndex: PropTypes.number.isRequired,
};

export default MediaModal;
