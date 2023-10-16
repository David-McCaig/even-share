import TopBar from "../Components/TopBar";
import Dashboard from "../features/dashboard/index"

function DashboardPage() {
  
  return (
    <div className="w-full bg-primary">
      <TopBar currentPage="Dashboard" />
      <Dashboard/>
    </div>
  );
}

export default DashboardPage;
