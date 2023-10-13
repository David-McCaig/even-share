import { useLocation } from "react-router";
import BalanceSummaryGroup from "./Component/BalanceSummaryGroup";
import BalanceSummaryAllGroups from "./Component/BalanceSummaryAllGroups";

function Index() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/recentactivity" || location.pathname === "/" || location.pathname === "/profile" ? (
        <>
          <BalanceSummaryAllGroups />
        </>
      ) : (
        <>
          <BalanceSummaryGroup />
        </>
      )}
    </>
  );
}

export default Index;
