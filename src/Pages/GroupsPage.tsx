import TopBar from "../Components/TopBar";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useFetchUserGroupsQuery } from "../features/groupexpense/groupexpenseTableSlice";
import GroupCards from "../features/dashboard/Components/GroupCards";
import CreateGroupModal from "../features/Navigation/Components/CreateGroupModal";
import BalanceSummary from "../features/balancesummary";

function GroupsPage() {
  const user = useAppSelector(selectUser);
  const { data: groups, isLoading, isError } = useFetchUserGroupsQuery(user.email);
  return <main className="groups-overview-page">
    <TopBar currentPage="Groups" />
    <div className="mobile-balance-summary"><BalanceSummary /></div>
    <header className="groups-page-heading"><div><h2>Groups</h2><p>You are part of {groups?.length ?? 0} groups</p></div><CreateGroupModal /></header>
    {isLoading ? <p className="empty-state" role="status">Loading your groups…</p> : isError ? <p className="empty-state" role="alert">Unable to load your groups. Please try again later.</p> : groups?.length ? <GroupCards groups={groups} compact /> : <div className="empty-state">Create your first group to start sharing expenses.</div>}
    <section className="new-group-card"><h3>A place for every shared expense</h3><p>Trips, rent, dinners, and everything in between.</p><CreateGroupModal /></section>
  </main>;
}
export default GroupsPage;
