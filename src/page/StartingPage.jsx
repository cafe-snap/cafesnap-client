import { useNavigate } from "react-router-dom";

const StartingPage = () => {
  const navigate = useNavigate();

  const loginRequest = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "post",
      });
      const data = await response.json();

      if (data.success) {
        navigate("/mainPage");
      }
    } catch (err) {
      alert(`로그인 요청 실패 = ${err}`);
    }
  };

  return(
    <div
      className="flex flex-col w-full min-h-screen bg-black items-center justify-center gap-4"
      onClick={loginRequest}
    >
      <span className="text-green-500 text-5xl">CAFESNAP</span>
      <span className="text-white text-2xl">로그인을 실행해주세요</span>
    </div>
  );
};

export default StartingPage;
