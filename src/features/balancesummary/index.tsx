import { useParams, useLocation } from "react-router";
import { useCalculateBalanceSummary } from "./hooks/useCalculateBalanceSummary";
import { useCalculateAllBalanceSummary } from "./hooks/useCalculateAllBalanceSummary";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { useDispatchGroupID } from "../groupexpense/hooks/useDispatchGroupID";
import BalanceSummaryColumn from "./Component/BalanceSummaryColumn";
import BalanceSummaryCard from "./Component/BalanceSummaryCard";
import { useEffect } from "react";

function Index() {
const location = useLocation()
console.log(location)
  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  const { balanceArray } = useCalculateBalanceSummary(groupId);
  const { allBalanceSummary } = useCalculateAllBalanceSummary()
console.log(allBalanceSummary)
  //TODO: Create a custom hook that iterates through group id and outputs balance summary for each group.
  return (
    <>
      {location.pathname === "/recentactivity" ? <BalanceSummaryColumn>
        {allBalanceSummary?.map((expense, i) => (
         <>
         <h3 className="mt-2 ml-4 font-semibold text-lg mb-2">{expense.groupName}</h3>
         <BalanceSummaryCard
            key={i}
            userName={
              typeof expense === "string" ? expense : expense.userString
            }
            userAmount={
              typeof expense === "string" ? 0 : expense.userNumber || 0
            }
          />
          </>
        ))}
      </BalanceSummaryColumn> : <BalanceSummaryColumn>
        {balanceArray?.map((expense, i) => (
          <BalanceSummaryCard
            key={i}
            userName={
              typeof expense === "string" ? expense : expense.userString
            }
            userAmount={
              typeof expense === "string" ? 0 : expense.userNumber || 0
            }
          />
        ))}
      </BalanceSummaryColumn>}
    </>
  );
}

export default Index;
