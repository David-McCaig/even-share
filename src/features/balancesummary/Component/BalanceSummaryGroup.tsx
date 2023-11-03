import { useCalculateBalanceSummary } from "../hooks/useCalculateBalanceSummary";
import BalanceSummaryCard from "./BalanceSummaryCard";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";

function BalanceSummaryGroup() {
    const { groupId } = useAppSelector((state) => state.groupId.groupId);
    const { balanceArray } = useCalculateBalanceSummary(groupId);

  return (
    <article>
    {balanceArray?.map((expense, i) => (
      <div key={i}>
        <BalanceSummaryCard
          userName={expense.userString}
          userAmount={expense.userNumber || 0}
        />
      </div>
    ))}
  </article>
  )
}

export default BalanceSummaryGroup