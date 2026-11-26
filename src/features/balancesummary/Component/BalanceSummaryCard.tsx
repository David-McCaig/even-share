interface BalanceSummaryProps { userName: string; userAmount: number }

function BalanceSummaryCard({ userName, userAmount }: BalanceSummaryProps) {
  const youOwe = userName?.startsWith("You owe ");
  const settled = userAmount === 0;
  const person = youOwe ? userName.slice(8) : userName.endsWith(" owes You") ? userName.slice(0, -9) : userName;
  const initials = person.split(" ").filter(Boolean).slice(0, 2).map(name => name[0]).join("");
  return (
    <article className="balance-row">
      <span className={`balance-avatar ${youOwe ? "warm" : ""}`} aria-hidden="true">{settled ? "✓" : initials}</span>
      <span className="balance-person"><span>{settled ? "Settled up" : person}</span>{!settled && <small className={youOwe ? "balance-negative" : "balance-positive"}>{youOwe ? "you owe" : "owes you"}</small>}</span>
      {!settled && <strong className={youOwe ? "balance-negative" : "balance-positive"}>{youOwe ? "−" : "+"}${userAmount.toFixed(2)}</strong>}
    </article>
  );
}
export default BalanceSummaryCard;
