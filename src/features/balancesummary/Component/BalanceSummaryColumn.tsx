import { ReactNode } from "react";
function BalanceSummaryColumn({ children }: { children: ReactNode }) {
  return <aside className="balance-summary-column">{children}</aside>;
}
export default BalanceSummaryColumn;
