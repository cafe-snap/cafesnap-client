import { useEffect, useState } from "react";
import MediaModal from "../components/MediaModal";
import LoadingModal from "../components/LoadingModal";

const MainPage = () => {
  const [crowlingData, setCrowlingData] = useState(null);
  const mediaSource = "목업 URL";
  const mediaType = "img";

  useEffect(() => {
    fetch("http://localhost:3000/crowling", {
      method: "post"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCrowlingData(data.message);
        } else {
          alert("크롤링 요청 실패");
        }
      })
      .catch((err) => {
        alert("크롤링 요청 실패" + err);
      });
  },[]);

  return(
    <div className="flex flex-col w-full min-h-screen bg-black items-center justify-center">
      {crowlingData === null ? <LoadingModal /> :
        <MediaModal source={mediaSource} type={mediaType} />}
      <div className="relative w-full justify-center flex-row mt-16 text-white flex">
        <span className="absolute left-0 ml-10">좌측</span>
        <div>{crowlingData !== null ? crowlingData[0].cafeName : ""}</div>
        <span className="absolute right-0 mr-10">우측</span>
      </div>
    </div>
  );
};

export default MainPage;
