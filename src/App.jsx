import { Route, Routes } from "react-router-dom";
import StartinPage from "./page/StartingPage";
import MainPage from "./page/MainPage";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<StartinPage />} />
      <Route path="/mainPage" element={<MainPage />} />
    </Routes>
  );
};

export default App;
