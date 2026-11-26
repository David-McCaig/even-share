import { Link } from "react-router-dom";
import GroupCards from "./Components/GroupCards";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../groupexpense/groupexpenseTableSlice";
import { useFetchRecentActivityQuery } from "../recentactivity/recentActivitySlice";
import BalanceSummaryAllGroups from "../balancesummary/Component/BalanceSummaryAllGroups";
import ExpenseList from "../../Components/ExpenseList";
import CreateGroupModal from "../Navigation/Components/CreateGroupModal";

function DashBoard() {
  const user = useAppSelector(selectUser);
  const { data: groups, isLoading, isError } = useFetchUserGroupsQuery(user.email);
  const { data: activity, isLoading: activityLoading, isError: activityError } = useFetchRecentActivityQuery(user.email);
  return (
    <div className="dashboard-content">
      <BalanceSummaryAllGroups overview />
      <div className="dashboard-columns">
        <section id="active-groups" className="dashboard-groups">
          <div className="section-heading"><h2>Active Groups <span>{groups?.length ?? 0}</span></h2><Link to="/groups">View all</Link></div>
          {isLoading ? <p className="empty-state" role="status">Loading your groups…</p> : isError ? <p className="empty-state" role="alert">Unable to load your groups. Please try again later.</p> : !groups?.length ? <div className="empty-state"><h3>A fresh start for shared expenses</h3><p>Create a group to split a trip, a home, or the everyday.</p><CreateGroupModal /></div> : (
            <GroupCards groups={groups} compact />
          )}
        </section>
        <section className="dashboard-activity">
          <div className="section-heading"><h2>Recent Activity</h2><Link to="/recentactivity">View all</Link></div>
          <div className="activity-card">
            {activityError && groups?.length ? <p className="empty-state" role="alert">Unable to load activity. Please try again later.</p> : <ExpenseList expenses={activity?.slice(0, 4) ?? []} showGroupName isLoading={activityLoading} emptyMessage="Your shared expenses will appear here." className="" />}
            <Link className="all-transactions-link" to="/recentactivity">See all transactions <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
export default DashBoard;
