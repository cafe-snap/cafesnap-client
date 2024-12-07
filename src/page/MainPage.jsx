import MediaModal from "../components/MediaModal";

const MainPage = () => {
  const mediaSource = "목업 URL";
  const mediaType = "img";

  return(
    <div className="flex flex-col w-full min-h-screen bg-black items-center justify-center">
      <MediaModal source={mediaSource} type={mediaType} />
      <div className="relative w-full justify-center flex-row mt-16 text-white flex">
        <span className="absolute left-0 ml-10">좌측</span>
        <div>미디어 정보 출력창</div>
        <span className="absolute right-0 mr-10">우측</span>
      </div>
    </div>
  );
};

export default MainPage;
