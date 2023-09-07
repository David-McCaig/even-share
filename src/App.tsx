import "./App.css";
import { useState } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx"
import Dashboard from "./Pages/Dashboard.tsx";
import BalanceSummary from "./features/balancesummary/Index.tsx";
import Login from "./features/authentication/components/Login";
import SignUp from "./features/authentication/components/SignUp";

import { Routes, Route } from "react-router";

function App() {

  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  const userInfo = useAppSelector(selectUser)

  return (
    <div className="w-full h-full">
      { userInfo && <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />}
      <div className="border-b-[.5px] border-slate-300"></div>
      <div className="flex m-auto h-screen max-w-5xl">
      {userInfo && <SideNavBar showNavBar={showNavBar} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={userInfo ? <Dashboard /> : <Navigate to="/"/>} />
      </Routes>
      {userInfo && <BalanceSummary/>}
      </div>
    </div>
  );
}

export default App;
