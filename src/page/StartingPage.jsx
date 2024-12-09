import { useNavigate } from "react-router-dom";

const StartinPage = () => {
  const navigate = useNavigate();

  const handleClickScreen = () => {
    fetch("http://localhost:3000/main", {
      method: "post"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/mainPage");
        } else {
          alert("로그인 요청 실패" + data.error);
        }
      })
      .catch((err) => {
        alert("로그인 요청 실패" + err);
      });
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
