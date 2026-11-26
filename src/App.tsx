import "./App.css";
import { useState } from "react";
import { useLocation } from "react-router";
import { Routes, Route } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import BalanceSummaryColumn from "./features/balancesummary/Component/BalanceSummaryColumn.tsx";
import routeObject from "./routesObject.tsx";

import { useSignedinDispatchUserInfo } from "./features/authentication/hooks/useSignedinDispatchUserInfo";

function App() {
  const isInitializing = useSignedinDispatchUserInfo();
  const [showNavBar, setShowNavBar] = useState<boolean>(true);

  const userInfo = useAppSelector(selectUser);

  const location = useLocation();

  // Preserve the requested URL until Firebase resolves the saved session.
  if (isInitializing) return <div className="min-h-screen flex items-center justify-center" role="status">Loading your session…</div>;

  const routesObject = routeObject(userInfo);

  return (
    <div className={userInfo ? "app-shell" : "w-full h-full text-primary-font-color"}>
      {userInfo && (
        <TopNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      )}

      <div
        className={
          location.pathname === "/"
            ? "m-auto h-full"
            : userInfo ? "app-layout" : "flex m-auto h-full max-w-5xl"
        }
      >
        {userInfo && (
          <SideNavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
        )}
        <Routes>
          {routesObject.map((route) => (
            <Route key={route?.id} path={route?.path} element={route?.element} />
          ))}
        </Routes>
        {userInfo && location.pathname !== "/dashboard" && (
          <BalanceSummaryColumn>
            <BalanceSummary />
          </BalanceSummaryColumn>
        )}
      </div>
    </div>
  );
}

export default App;
