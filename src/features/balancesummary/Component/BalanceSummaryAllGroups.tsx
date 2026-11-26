import { useCalculateAllBalanceSummary } from "../hooks/useCalculateAllBalanceSummary";
import type { BalanceSummary } from "../../../types";
import BalanceGroup from "./BalanceGroup";

function BalanceSummaryAllGroups({ overview = false }: { overview?: boolean }) {
  const { allBalanceSummary, balanceErrors } = useCalculateAllBalanceSummary();
  const grouped = allBalanceSummary.reduce<Record<string, BalanceSummary[]>>((groups, balance) => {
    const key = balance.sourceGroupId || balance.groupName || "Shared balances";
    (groups[key] ??= []).push(balance);
    return groups;
  }, {});

  return (
    <div className={overview ? "balance-overview" : "balance-groups"}>
      <section className="net-balance-card">
        <div className="section-heading"><h2>Your Balance</h2></div>
        <p className="balance-breakdown-description">By group &amp; friend</p>
        <div className="balance-breakdown-list">
          {Object.entries(grouped).map(([id, balances]) => <BalanceGroup key={id} name={balances[0].groupName || "Shared balances"} balances={balances} />)}
          {Object.entries(balanceErrors).map(([id, error]) => <p key={id} role="alert">{error}</p>)}
          {!allBalanceSummary.length && !Object.keys(balanceErrors).length && <p className="balance-neutral">No shared balances yet.</p>}
        </div>
      </section>
    </div>
  );
}
export default BalanceSummaryAllGroups;
