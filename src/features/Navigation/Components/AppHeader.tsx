import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import AddExpenseModal from "../../groupexpense/Components/AddExpenseModal";
import SettleUpExpenseModal from "../../groupexpense/Components/SettleUpExpenseModal";

export default function AppHeader() {
  return (
    <header className="app-topnav">
      <div className="topnav-brand">
        <Link to="/dashboard" className="app-brand"><BarChart3 size={25} /><span>evenshare</span></Link>
      </div>
      <div className="page-actions">
        <AddExpenseModal />
        <SettleUpExpenseModal />
      </div>
    </header>
  );
}
