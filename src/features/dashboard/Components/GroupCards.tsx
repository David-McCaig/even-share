import { Link } from "react-router-dom";
import { useCreateDataStructureForUserTotals } from "../hooks/useCreateDataStructureForUserTotals";
import PieChart from "./PieChart";
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
        <PieChart compact={compact} personalBalance={<PersonalBalance groupId={group.id} />} subtitle={`${group.user_group_email?.length ?? 0} members`} groupName={group.user_group_name} chartData={{ labels: contributions?.user_group_totals.map(data => compact ? data.user_expense_name : `${data.user_expense_name} $${data.user_expense_amount.toFixed(2)}`) ?? [], datasets: [{ data: contributions?.user_group_totals.map(data => data.user_expense_amount) ?? [] }] }} />
      </Link>;
    })}
  </div>;
}
function PersonalBalance({ groupId }: { groupId: string }) {
  const { balanceArray } = useCalculateBalanceSummary(groupId);
  const { isFetching, isError } = useFetchExpensesForBalanceSummaryGroupQuery(groupId);
  const { owed, owing } = getPersonalBalance(balanceArray);
  return <div className="group-personal-balance">
    <span>Your Balance</span>
    {isError ? <span>Unavailable</span> : isFetching || !balanceArray.length ? <span role="status">Loading…</span> : <BalanceTotals owed={owed} owing={owing} />}
  </div>;
}
export default GroupCards;
