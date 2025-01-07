import PropTypes from "prop-types";

const MediaModal = ({ source, type }) => {

  return(
    <div className="fixed top-5 left-0 border-2 border-green-800 w-full h-[400px] justify-center items-center bg-black">
      {type === "img" ? (
        <img className="object-contain w-auto h-full max-w-full" src={source} />
      ) : (
        <video
          className="object-contain w-auto h-full max-w-full"
          src={source}
          autoPlay
          playsInline
          controls
          muted
        />
      )}
    </div>
  );
};

MediaModal.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default MediaModal;
