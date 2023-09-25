import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTable from "../features/expensetable/index"

function Dashboard() {

  return (
    <div className="w-full bg-primary">
      <TopBar
        currentPage={"Dashboard"}

      />
      <div className="lg:hidden" >
        <BalanceSummaryCard userName="Dave" userAmount={20} />
      </div>
      <ExpenseTable/>
    </div>
  );
}

export default Dashboard;
