import { useLocation } from "react-router";
import { useCalculateBalanceSummary } from "./hooks/useCalculateBalanceSummary";
import { useCalculateAllBalanceSummary } from "./hooks/useCalculateAllBalanceSummary";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import BalanceSummaryColumn from "./Component/BalanceSummaryColumn";
import BalanceSummaryCard from "./Component/BalanceSummaryCard";
import { Key } from "react";
import { GroupExpenses } from "../../types";

function Index() {
  const location = useLocation();
  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  const { balanceArray } = useCalculateBalanceSummary(groupId);
  const { allBalanceSummary } = useCalculateAllBalanceSummary();
console.log(balanceArray)
  const groupedExpenses = groupExpensesByGroupName(allBalanceSummary);

  function groupExpensesByGroupName(expenses) {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.groupName]) {
        acc[expense.groupName] = [];
      }
      acc[expense.groupName].push(expense);
      return acc;
    }, {});
  }

  return (
    <>
      {location.pathname === "/recentactivity" ? (
        <BalanceSummaryColumn>
          {Object.keys(groupedExpenses).map((groupName) => (
            <div key={groupName}>
              <h3 className="mt-2 ml-4 font-semibold text-lg mb-2">{groupName}</h3>
              {groupedExpenses[groupName].map((expense:GroupExpenses , i: Key | null | undefined) => (
                <BalanceSummaryCard
                  key={i}
                  userName={expense.userString}
                  userAmount={expense.userNumber || 0}
                />
              ))}
            </div>
          ))}
        </BalanceSummaryColumn>
      ) : (
        <BalanceSummaryColumn>
          {balanceArray?.map((expense, i) => (
            <div key={i}>
              <BalanceSummaryCard
                userName={expense.userString}
                userAmount={expense.userNumber || 0}
              />
            </div>
          ))}
        </BalanceSummaryColumn>
      )}
    </>
  );
}

export default Index;

