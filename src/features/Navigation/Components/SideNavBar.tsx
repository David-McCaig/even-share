import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, History, Users, User, X, BarChart3, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { selectUser, logout } from "../../authentication/userSlice";
import { auth } from "../../../firebase/firebaseconfig";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../Components/ui/dropdown-menu";
import CreateGroupModal from "./CreateGroupModal";

type NavBarProps = {
  showNavBar: boolean;
  setShowNavBar: (value: boolean) => void;
};

function NavBar({ showNavBar, setShowNavBar }: NavBarProps) {
  const user = useAppSelector(selectUser);
  const { data: groups } = useFetchUserGroupsQuery(user?.email);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    auth.signOut().then(() => { dispatch(logout()); navigate("/login"); })
      .catch(error => console.error("Error signing out:", error));
  };
  const closeNav = () => setShowNavBar(true);

  return (
    <>
      {!showNavBar && <button className="sidebar-scrim" aria-label="Close navigation" onClick={closeNav} />}
      <aside id="app-sidebar" className={`app-sidebar ${!showNavBar ? "is-open" : ""}`} aria-label="Sidebar">
        <Link to="/dashboard" className="app-brand" onClick={closeNav}>
          <BarChart3 size={27} strokeWidth={1.7} /> <span>evenshare</span>
        </Link>
        <button className="sidebar-close" onClick={closeNav} aria-label="Close navigation"><X size={20} /></button>
        <nav aria-label="Main navigation" className="sidebar-links">
          <NavLink to="/dashboard" onClick={closeNav}><LayoutDashboard size={19} />Dashboard</NavLink>
          <NavLink to="/recentactivity" onClick={closeNav}><History size={19} />Recent Activity</NavLink>
          <NavLink to="/groups" onClick={closeNav} className="sidebar-group-heading"><Users size={19} /><span>Groups</span><span className="nav-count">{groups?.length ?? 0}</span></NavLink>
          <div className="sidebar-groups">
            {groups?.map(group => (
              <NavLink key={group.id} to={`/group/${group.id}`} onClick={closeNav}>
                <span className="group-dot" /> <span className="truncate">{group.user_group_name}</span>
              </NavLink>
            ))}
            <CreateGroupModal />
          </div>
          <NavLink to="/profile" onClick={closeNav}><User size={19} />Profile</NavLink>
        </nav>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <button type="button" className="sidebar-account" aria-label="Open account menu">
          <span className="user-initial">{(user?.displayName || user?.email || "U").slice(0, 1).toUpperCase()}</span>
          <span className="min-w-0"><strong className="block truncate">{user?.displayName || "Your account"}</strong><small className="block truncate">{user?.email}</small></span>
        </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          <DropdownMenuItem onClick={() => { closeNav(); navigate("/profile"); }}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </aside>
      <nav className="mobile-navigation" aria-label="Mobile navigation">
        <NavLink to="/dashboard" onClick={closeNav}><LayoutDashboard size={21} /><span>Dashboard</span></NavLink>
        <NavLink to="/recentactivity" onClick={closeNav}><History size={21} /><span>Activity</span></NavLink>
        <NavLink to="/groups" className={pathname.startsWith("/group/") ? "active" : undefined} onClick={closeNav}><Users size={21} /><span>Groups</span></NavLink>
        <NavLink to="/profile" onClick={closeNav}><User size={21} /><span>Profile</span></NavLink>
      </nav>
    </>
  );
}
export default NavBar;
