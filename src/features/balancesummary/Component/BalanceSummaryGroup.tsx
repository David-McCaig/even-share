import { useCalculateBalanceSummary } from "../hooks/useCalculateBalanceSummary";
import BalanceSummaryCard from "./BalanceSummaryCard";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { getPersonalBalance } from "../../../utils/utils";
import BalanceTotals from "./BalanceTotals";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balanceSummarySlice";

function BalanceSummaryGroup() {
  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  const { balanceArray } = useCalculateBalanceSummary(groupId);
  const { isFetching, isError } = useFetchExpensesForBalanceSummaryGroupQuery(groupId);
  const { owed, owing } = getPersonalBalance(balanceArray);

  return (
    <article className="group-balance-summary">
      <div className="section-heading"><h2>Your Balance</h2></div>
      <div className="group-balance-totals">{isError ? <p>Unavailable</p> : isFetching || !balanceArray.length ? <p role="status">Loading…</p> : <BalanceTotals owed={owed} owing={owing} />}</div>
      {!isError && !isFetching && balanceArray?.filter(expense => expense.userNumber > 0).map((expense) => (
        <div className="mb-2" key={`${expense.groupId}-${expense.userString}`}>
          <BalanceSummaryCard
            userName={expense.userString}
            userAmount={expense.userNumber || 0}
          />
        </div>
      ))}
    </article>
  );
}

export default BalanceSummaryGroup;
