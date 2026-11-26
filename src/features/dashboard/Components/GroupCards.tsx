import { Link } from "react-router-dom";
import { useCreateDataStructureForUserTotals } from "../hooks/useCreateDataStructureForUserTotals";
import GroupContributionsCard from "./GroupContributionsCard";
import { useCalculateBalanceSummary } from "../../balancesummary/hooks/useCalculateBalanceSummary";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../../balancesummary/balanceSummarySlice";
import { getPersonalBalance } from "../../../utils/utils";
import type { UserGroup } from "../../../types";
import BalanceTotals from "../../balancesummary/Component/BalanceTotals";

function GroupCards({ groups, compact = false }: { groups: UserGroup[]; compact?: boolean }) {
  const { totalUserExpensesData } = useCreateDataStructureForUserTotals();
  return <div className="group-card-grid">
    {groups.map(group => {
      const contributions = totalUserExpensesData.find(data => data.id === group.id);
      return <Link key={group.id} to={`/group/${group.id}`} className="group-card-link">
        <GroupContributionsCard compact={compact} personalBalance={<PersonalBalance groupId={group.id} />} subtitle={`${group.user_group_email?.length ?? 0} members`} groupName={group.user_group_name} contributions={contributions?.user_group_totals.map(data => ({ name: data.user_expense_name, amount: data.user_expense_amount })) ?? []} />
      </Link>;
    })}
  </div>;
}
function PersonalBalance({ groupId }: { groupId: string }) {
  const { balanceArray, balanceError, isLoading } = useCalculateBalanceSummary(groupId);
  const { isFetching, isError } = useFetchExpensesForBalanceSummaryGroupQuery(groupId);
  const { owed, owing } = getPersonalBalance(balanceArray);
  return <div className="group-personal-balance">
    <span>Your Balance</span>
    {balanceError || isError ? <span role="alert">{balanceError || "Unavailable"}</span> : isLoading || isFetching ? <span role="status">Loading…</span> : <BalanceTotals owed={owed} owing={owing} />}
  </div>;
}
export default GroupCards;
