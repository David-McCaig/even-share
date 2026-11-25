import { useCalculateAllBalanceSummary } from "../hooks/useCalculateAllBalanceSummary";
import { getPersonalBalance } from "../../../utils/utils";
import BalanceTotals from "./BalanceTotals";

function BalanceSummaryAllGroups({ overview = false }: { overview?: boolean }) {
  const { allBalanceSummary } = useCalculateAllBalanceSummary();
  const { owed, owing } = getPersonalBalance(allBalanceSummary);

  return (
    <div className={overview ? "balance-overview" : "balance-groups"}>
      <section className="net-balance-card">
        <div className="section-heading"><h2>Your Balance</h2></div>
        <BalanceTotals owed={owed} owing={owing} showZeroBalances />
      </section>
    </div>
  );
}
export default BalanceSummaryAllGroups;
