import "./App.css";
import { useState } from "react";
import { Navigate } from "react-router";
import { Routes, Route } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx";
import Dashboard from "./Pages/DashboardPage.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import GroupExpense from "./Pages/GroupExpensePage.tsx";
import Login from "./Pages/LoginPage.tsx";
import SignUp from "./Pages/SignUpPage.tsx";
import RecentActivityPage from "./Pages/RecentActivityPage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import BalanceSummaryColumn from "./features/balancesummary/Component/BalanceSummaryColumn.tsx";

function App() {
  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  const userInfo = useAppSelector(selectUser);

  return (
    <div className="w-full h-full bg-primary-bg-color text-primary-font-color">
      {userInfo && <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />}
      <div className="border-b-[.5px]"></div>
      <div className="flex m-auto h-full max-w-5xl">
        {userInfo && <SideNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />}
        <Routes>
          <Route
            path="login"
            element={userInfo ? <Navigate to="/app" /> : <Login />}
          />
          <Route
            path="signup"
            element={userInfo ? <Navigate to="/app" /> : <SignUp />}
          />
          <Route
            path="dashboard"
            element={userInfo ? <Dashboard /> : <Navigate to="/app/login" />}
          />
          <Route
            path="group/:id"
            element={userInfo ? <GroupExpense /> : <Navigate to="/app/login" />}
          />
          <Route
            path="recentactivity"
            element={
              userInfo ? <RecentActivityPage /> : <Navigate to="/app/login" />
            }
          />
          <Route
            path="profile"
            element={userInfo ? <ProfilePage /> : <Navigate to="/app/login" />}
          />
        </Routes>
        {userInfo && (
          <BalanceSummaryColumn>
            <BalanceSummary />
          </BalanceSummaryColumn>
        )}
      </div>
    </div>
  );
}

export default App;

