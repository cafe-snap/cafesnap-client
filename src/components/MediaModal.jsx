import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const MediaModal = ({ source, totalMediaCount, currentMediaIndex }) => {
  const [isShowControl, setIsShowControl] = useState(false);
  const [progressWidths, setProgressWidths] = useState(
    Array(totalMediaCount).fill(0)
  );
  const videoRef = useRef(null);

  const toggleControl = () => {
    setIsShowControl((prev) => !prev);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const updateProgress = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        setProgressWidths((prevWidths) =>
          prevWidths.map((width, index) =>
            index === currentMediaIndex ? progress : width
          )
        );
      }
    };

    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentMediaIndex]);

  useEffect(() => {
    setProgressWidths((prevWidths) =>
      prevWidths.map((_, index) =>
        index < currentMediaIndex ? 100 : index === currentMediaIndex ? 0 : 0
      )
    );
  }, [currentMediaIndex]);

  return (
    <div
      className="flex flex-col mt-10 w-full h-[400px] justify-center items-center bg-black overflow-hidden"
      onClick={toggleControl}
    >
      <div className="relative w-full h-2 z-10 flex justify-between">
        {Array.from({ length: totalMediaCount }).map((_, index) => (
          <div
            key={index}
            className="relative h-full bg-gray-800"
            style={{
              width: `calc(${100 / totalMediaCount}% - 4px)`,
              marginLeft: index === 0 ? "0px" : "4px",
            }}
          >
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all"
              style={{
                width: `${progressWidths[index]}%`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
        <video
          ref={videoRef}
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
