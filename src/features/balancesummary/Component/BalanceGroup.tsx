import type { BalanceSummary } from "../../../types";
import { getPersonalBalance } from "../../../utils/utils";
import BalanceSummaryCard from "./BalanceSummaryCard";

function BalanceGroup({ name, balances }: { name: string; balances: BalanceSummary[] }) {
  const { net } = getPersonalBalance(balances);
  const outstanding = balances.filter(balance => balance.userNumber > 0);
  return <section className="balance-breakdown-group">
    <div className="balance-breakdown-heading"><h3>{name}</h3><span className={net > 0 ? "balance-positive" : net < 0 ? "balance-negative" : "balance-neutral"}>{!outstanding.length ? "Settled up" : `${net > 0 ? "+" : net < 0 ? "−" : ""}$${Math.abs(net).toFixed(2)}`}</span></div>
    {outstanding.map((balance, index) => <BalanceSummaryCard key={`${balance.userString}-${index}`} userName={balance.userString} userAmount={balance.userNumber} />)}
  </section>;
}

export default BalanceGroup;
