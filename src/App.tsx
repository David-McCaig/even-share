import "./App.css";
import { useState } from "react";
import { Navigate } from "react-router";
import { Routes, Route } from "react-router";
import { useAppSelector } from "./hooks/reduxTypeScriptHooks.tsx";
import { selectUser } from "./features/authentication/userSlice.tsx";
import TopNavBar from "./features/Navigation/Components/TopNavBar.tsx";
import SideNavBar from "./features/Navigation/Components/SideNavBar.tsx";
import BalanceSummary from "./features/balancesummary/index.tsx";
import BalanceSummaryColumn from "./features/balancesummary/Component/BalanceSummaryColumn.tsx";
import { routesData } from "./routes.tsx";




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
          {/* see routes.tsx to add a route */}
          {routesData.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.requiresAuth
                  ? userInfo
                    ? route.element
                    : <Navigate to="/login" />
                  : route.element
              }
            />
          ))}
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
