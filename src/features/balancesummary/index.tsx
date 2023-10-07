import { useCalculateBalanceSummary } from "./hooks/useCalculateBalanceSummary";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import BalanceSummaryColumn from "./Component/BalanceSummaryColumn";
import BalanceSummaryCard from "./Component/BalanceSummaryCard";

function Index() {
  const { groupId } = useAppSelector((state) => state.groupId.groupId);

  const { balanceArray } = useCalculateBalanceSummary(groupId);
  return (
    <>
      <BalanceSummaryColumn>
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
      </BalanceSummaryColumn>
    </>
  );
}

export default Index;
