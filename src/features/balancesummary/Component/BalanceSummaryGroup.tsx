import { useCalculateBalanceSummary } from "../hooks/useCalculateBalanceSummary";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import BalanceGroup from "./BalanceGroup";
import { selectUser } from "../../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balanceSummarySlice";

function BalanceSummaryGroup() {
  const { groupId } = useAppSelector((state) => state.groupId.groupId);
  const { balanceArray, balanceError, isLoading } = useCalculateBalanceSummary(groupId);
  const { isFetching, isError } = useFetchExpensesForBalanceSummaryGroupQuery(groupId);
  const user = useAppSelector(selectUser);
  const { data: groups } = useFetchUserGroupsQuery(user.email);
  const name = groups?.find(group => group.id === groupId)?.user_group_name || "This group";

  return (
    <article className="group-balance-summary">
      <div className="section-heading"><h2>Your Balance</h2></div>
      <div className="balance-breakdown-list">{balanceError || isError ? <p role="alert">{balanceError || "Unavailable"}</p> : isLoading || isFetching ? <p role="status">Loading…</p> : <BalanceGroup name={name} balances={balanceArray} />}</div>
    </article>
  );
}

export default BalanceSummaryGroup;
