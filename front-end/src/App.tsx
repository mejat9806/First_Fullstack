import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./UI/Login";
import Home from "./UI/Home";
import UserPage from "./UI/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
