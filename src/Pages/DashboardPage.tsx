import PageHeader from "../Components/PageHeader";
import Dashboard from "../features/dashboard/index"

function DashboardPage() {
  
  return (
    <main className="w-full bg-primary">
      <PageHeader currentPage="Dashboard" />
      <Dashboard/>
    </main>
  );
}

export default DashboardPage;
