import PropTypes from "prop-types";

const MediaModal = ({ source, type }) => {

  return(
    <div className="flex mt-8 border-2 border-green-800 w-full h-[400px] justify-center items-center bg-black">
      {type === "img" ? (
        <img className="object-contain w-auto h-full max-w-full" src={source} />
      ) : (
        <video className="object-contain w-auto h-full max-w-full" src={source} autoPlay playsInline controls/>
      )}
    </div>
  );
};

MediaModal.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default MediaModal;
