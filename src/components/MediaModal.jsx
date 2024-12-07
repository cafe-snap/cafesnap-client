import PropTypes from "prop-types";

const MediaModal = ({ source, type }) => {

  return(
    <div className="flex mt-36 w-10/12 h-full border-2 border-color-white">
      {type === "img" ? (
        <img className="w-full h-full object-contain" src={source} />
      ) : (
        <video className="w-full h-full" src={source} autoPlay playsInline/>
      )}
    </div>
  );
};

MediaModal.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default MediaModal;
