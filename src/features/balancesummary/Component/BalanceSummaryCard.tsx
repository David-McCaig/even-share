interface BalanceSummaryProps { userName: string; userAmount: number }

function BalanceSummaryCard({ userName, userAmount }: BalanceSummaryProps) {
  const youOwe = userName?.startsWith("You owe ");
  const settled = userAmount === 0;
  const label = settled ? "Settled up" : youOwe ? userName : userName?.endsWith(" owes You") ? `${userName.slice(0, -9)} owes you` : userName;
  return (
    <article className="balance-row">
      <span className={`balance-avatar ${youOwe ? "warm" : ""}`} aria-hidden="true">{settled ? "✓" : userName?.startsWith("You ") ? userName.split(" ")[2]?.slice(0, 1) : userName?.slice(0, 1)}</span>
      <span className="balance-person">{label}</span>
      {!settled && <strong className={youOwe ? "balance-negative" : "balance-positive"}>${userAmount.toFixed(2)}</strong>}
    </article>
  );
}
export default BalanceSummaryCard;
