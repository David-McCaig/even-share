import TopBar from "../Components/TopBar";
import Dashboard from "../features/dashboard/index"

function DashboardPage() {
  
  return (
    <main className="w-full bg-primary">
      <TopBar currentPage="Dashboard" />
      <Dashboard/>
    </main>
  );
}

export default DashboardPage;
