function BalanceTotals({ owed, owing, showZeroBalances = false }: { owed: number; owing: number; showZeroBalances?: boolean }) {
  if (owed === 0 && owing === 0) return <p className="balance-neutral">Settled up</p>;

  return <dl className="balance-totals">
    {(owed > 0 || showZeroBalances) && <div><dt>You’re owed</dt><dd className={owed > 0 ? "balance-positive" : "balance-neutral"}>${owed.toFixed(2)}</dd></div>}
    {(owing > 0 || showZeroBalances) && <div><dt>You owe</dt><dd className={owing > 0 ? "balance-negative" : "balance-neutral"}>${owing.toFixed(2)}</dd></div>}
  </dl>;
}

export default BalanceTotals;
