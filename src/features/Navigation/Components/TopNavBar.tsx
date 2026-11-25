import { Link } from "react-router-dom";
import { BarChart3, Menu } from "lucide-react";
import AddExpenseModal from "../../groupexpense/Components/AddExpenseModal";
import SettleUpExpenseModal from "../../groupexpense/Components/SettleUpExpenseModal";

type NavBarProps = { showNavBar: boolean; setShowNavBar: (value: boolean) => void };

export default function NavBar({ showNavBar, setShowNavBar }: NavBarProps) {
  return (
    <header className="app-topnav">
      <div className="topnav-brand">
        <button type="button" className="mobile-menu-button" aria-label="Open navigation" aria-expanded={!showNavBar} aria-controls="app-sidebar" onClick={() => setShowNavBar(!showNavBar)}><Menu size={21} /></button>
        <Link to="/dashboard" className="app-brand"><BarChart3 size={25} /><span>evenshare</span></Link>
      </div>
      <div className="page-actions">
        <AddExpenseModal />
        <SettleUpExpenseModal />
      </div>
    </header>
  );
}
