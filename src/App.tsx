import { Route, Routes } from "react-router-dom";
import StartingPage from "./page/StartingPage";
import MainPage from "./page/MainPage";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<StartingPage />} />
      <Route path="/mainPage" element={<MainPage />} />
    </Routes>
  );
};

export default App;
