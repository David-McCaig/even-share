import "./App.css";
import { useState } from "react";
import { Navigate } from "react-router";
import { Routes, Route } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx"
import Dashboard from "./Pages/Dashboard.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import GroupExpense from "./Pages/GroupExpense.tsx";
import Login from "./Pages/LoginPage.tsx";
import SignUp from "./features/authentication/components/SignUp";

function App() {

  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  const userInfo = useAppSelector(selectUser)

  return (
    <div className="w-full h-full bg-primary-bg-color text-primary-font-color">
      { userInfo && <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />}
      <div className="border-b-[.5px]"></div>
      <div className="flex m-auto h-screen max-w-5xl">
      {userInfo && <SideNavBar showNavBar={showNavBar} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={userInfo ? <Dashboard /> : <Navigate to="/login"/>} />
        <Route path="/group/:id" element={userInfo ? <GroupExpense/> : <Navigate to="/login"/>} />
      </Routes>
      {userInfo && <BalanceSummary/>}
      </div>
    </div>
  );
}

export default App;
