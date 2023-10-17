import { Key } from "react";
import { useCalculateAllBalanceSummary } from "../hooks/useCalculateAllBalanceSummary";
import BalanceSummaryCard from "./BalanceSummaryCard";
import { GroupExpenses } from "../../../types";

function BalanceSummaryAllGroups() {
  const { allBalanceSummary } = useCalculateAllBalanceSummary();
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
      {Object.keys(groupedExpenses).map((groupName) => (
        <div key={groupName}>
          <h3 className="mt-2 ml-4 text-neutral-500 font-semibold text-lg mb-2">
            {groupName}
          </h3>
          {groupedExpenses[groupName].map(
            (expense: GroupExpenses, i: Key | null | undefined) => (
              <BalanceSummaryCard
                key={i}
                userName={expense.userString}
                userAmount={expense.userNumber || 0}
              />
            )
          )}
        </div>
      ))}
    </>
  );
}

export default BalanceSummaryAllGroups;
