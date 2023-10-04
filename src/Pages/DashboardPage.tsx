import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTable from "../features/groupexpense/index"

function Dashboard() {

  return (
    <div className="w-full bg-primary">

      <div className="lg:hidden" >
        <BalanceSummaryCard userName="Dave" userAmount={20} />
      </div>
      <ExpenseTable/>
    </div>
  );
}

export default Dashboard;
