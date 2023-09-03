import "./App.css";
import TopNavBar from "./features/Navigation/TopNavBar.tsx";
import Home from "./Pages/Home";
import Login from "./features/authentication/components/Login";
import SignUp from "./features/authentication/components/SignUp";

import { Routes, Route } from "react-router";

function App() {
  return (
    <div>
      <TopNavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
