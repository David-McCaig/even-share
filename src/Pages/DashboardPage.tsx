import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTable from "../features/expensetable/index"

function Dashboard() {
  const AddExpenseClick = () => {};

  const AddSettleUpClick = () => {};

  return (
    <div className="w-full bg-primary">
      <TopBar
        currentPage={"Dashboard"}
        AddExpenseClick={AddExpenseClick}
        AddSettleUpClick={AddSettleUpClick}
      />
      <div className="lg:hidden" >
        <BalanceSummaryCard />
      </div>
      <ExpenseTable/>
    </div>
  );
}

export default Dashboard;
