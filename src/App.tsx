import React, { lazy, Suspense, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import Loader from "./Components/LoadingDots.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import BalanceSummaryColumn from "./features/balancesummary/Component/BalanceSummaryColumn.tsx";

// Lazy load components
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const Login = lazy(() => import("./Pages/LoginPage"));
const SignUp = lazy(() => import("./Pages/SignUpPage"));
const Dashboard = lazy(() => import("./Pages/DashboardPage"));
const GroupExpense = lazy(() => import("./Pages/GroupExpensePage"));
const RecentActivityPage = lazy(() => import("./Pages/RecentActivityPage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));

function App() {
  const [showNavBar, setShowNavBar] = useState<boolean>(true);
  const userInfo = useAppSelector(selectUser);
  const location = useLocation();

  const routes = [
    { id: 1, path: "/", element: <LandingPage /> },
    {
      id: 2,
      path: "/login",
      element: userInfo ? <Navigate to="/dashboard" /> : <Login />,
    },
    {
      id: 3,
      path: "/signup",
      element: userInfo ? <Navigate to="/dashboard" /> : <SignUp />,
    },
    {
      id: 4,
      path: "/dashboard",
      element: userInfo ? <Dashboard /> : <Navigate to="/login" />,
    },
    {
      id: 5,
      path: "/group/:id",
      element: userInfo ? <GroupExpense /> : <Navigate to="/login" />,
    },
    {
      id: 6,
      path: "/recentactivity",
      element: userInfo ? <RecentActivityPage /> : <Navigate to="/login" />,
    },
    {
      id: 7,
      path: "/profile",
      element: userInfo ? <ProfilePage /> : <Navigate to="/login" />,
    },
  ];

  return (
    <div className="w-full h-full text-primary-font-color">
      {userInfo && (
        <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      )}
      <div className="border-b-[.5px]"></div>
      <div
        className={
          location.pathname === "/"
            ? "m-auto h-full"
            : "flex m-auto h-full max-w-5xl"
        }
      >
        {userInfo && (
          <SideNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
        )}
        <Suspense
          fallback={
            <div className="w-full h-full flex justify-center self-center">
              <Loader />
            </div>
          }
        >
          <Routes>
            {routes.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
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
