import "./App.css";
import { useState } from "react";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx"
import Home from "./Pages/Home";
import Login from "./features/authentication/components/Login";
import SignUp from "./features/authentication/components/SignUp";

import { Routes, Route } from "react-router";

function App() {

  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  return (
    <div className="">
      <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      <div className="border-b-[.5px] border-slate-300"></div>
      <div className="flex m-auto h-screen max-w-5xl">
      <SideNavBar showNavBar={showNavBar} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
