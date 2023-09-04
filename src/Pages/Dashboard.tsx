import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";

function Dashboard() {
  const AddExpenseClick = () => {};

  const AddSettleUpClick = () => {};

  return (
    <div className="w-full">
      <TopBar
        currentPage={"Dashboard"}
        AddExpenseClick={AddExpenseClick}
        AddSettleUpClick={AddSettleUpClick}
      />
      <div className="lg:hidden" >
        <BalanceSummaryCard />
      </div>
    </div>
  );
}

export default Dashboard;
