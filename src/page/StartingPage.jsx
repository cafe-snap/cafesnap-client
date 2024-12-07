import { useNavigate } from "react-router-dom";

const StartinPage = () => {
  const navigate = useNavigate();
  const handleClickScreen = () => {
    navigate("/mainPage");
  };

  return(
    <div
      className="flex flex-col w-full min-h-screen bg-black items-center justify-center gap-4"
      onClick={handleClickScreen}
    >
      <span className="text-green-500 text-5xl">CAFESNAP</span>
      <span className="text-white text-2xl">로그인을 실행해주세요</span>
    </div>
  );
};

export default StartinPage;
