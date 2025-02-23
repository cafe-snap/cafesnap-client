import { useNavigate } from "react-router-dom";
import useApiStore from "../store/useApiStore";
import { useEffect } from "react";


const StartingPage = () => {
  const { fetchLoginApi, isNavigate } = useApiStore();
  const navigate = useNavigate();

  const handleOnClick = async () => {
    await fetchLoginApi();
  };

  useEffect(() => {
    if (isNavigate) {
      navigate("/mainPage");
    }
  }, [isNavigate]);

  return(
    <div
      className="flex flex-col w-full min-h-screen bg-black items-center justify-center gap-4"
      onClick={handleOnClick}
    >
      <span className="text-green-500 text-5xl">CAFESNAP</span>
      <span className="text-white text-2xl">로그인을 실행해 주세요</span>
    </div>
  );
};

export default StartingPage;
