import "./App.css";
import { useLocation } from "react-router";
import { Routes, Route } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import AppHeader from "./features/Navigation/Components/AppHeader.tsx";
import AppNavigation from "./features/Navigation/Components/AppNavigation.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import BalanceSummaryColumn from "./features/balancesummary/Component/BalanceSummaryColumn.tsx";
import routeObject from "./routesObject.tsx";

import { useSignedinDispatchUserInfo } from "./features/authentication/hooks/useSignedinDispatchUserInfo";

function App() {
  const isInitializing = useSignedinDispatchUserInfo();

  const userInfo = useAppSelector(selectUser);

  const location = useLocation();

  // Preserve the requested URL until Firebase resolves the saved session.
  if (isInitializing) return <div className="min-h-screen flex items-center justify-center" role="status">Loading your session…</div>;

  const routesObject = routeObject(userInfo);

  return (
    <div className={userInfo ? "app-shell" : "w-full h-full text-primary-font-color"}>
      {userInfo && (
        <AppHeader />
      )}

      <div
        className={
          location.pathname === "/"
            ? "m-auto h-full"
            : userInfo ? "app-layout" : "flex m-auto h-full max-w-5xl"
        }
      >
        {userInfo && (
          <AppNavigation />
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
