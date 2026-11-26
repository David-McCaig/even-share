import { useParams } from "react-router";
import { useDispatchGroupID } from "../../features/groupexpense/hooks/useDispatchGroupID";
import { usePagination } from "../../hooks/usePagination";
import {
  useFetchExpensesForGroupQuery,
  useFetchUserGroupsQuery,
  useLazyFetchPaginatedExpensesForGroupQuery,
} from "./groupexpenseTableSlice";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../features/authentication/userSlice";
import GroupContributionsCard from "../dashboard/Components/GroupContributionsCard";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balancesummary/balanceSummarySlice";
import { totalUserExpenses } from "../../utils/utils";
import { Button } from "../../Components/ui/button";
import PageHeader from "../../Components/PageHeader";
import BalanceSummary from "../../features/balancesummary/index";
import ExpenseList from "../../Components/ExpenseList";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
};

function Index() {
  const id = useParams<UrlParams>()?.id;
  const user = useAppSelector(selectUser);
  const { data: groups } = useFetchUserGroupsQuery(user.email);
  const group = groups?.find(group => group.id === id);
  const { data: balanceExpenses } = useFetchExpensesForBalanceSummaryGroupQuery(id);
  const contributions = totalUserExpenses(balanceExpenses) || [];
  useDispatchGroupID(id);

  const {
    currentData: groupExpensesData,
    fulfilledTimeStamp,
    isLoading,
    isError: expensesIsError,
    error: expensesError,
  } = useFetchExpensesForGroupQuery(id);

  const [fetchNextPage] = useLazyFetchPaginatedExpensesForGroupQuery();
  const { expenses: groupExpenses, hasMore, isFetching, error: pageError, showMore } = usePagination(
    id ?? "", groupExpensesData, request => fetchNextPage(request).unwrap(), fulfilledTimeStamp
  );

  if (expensesIsError) {
    console.error(expensesError);
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-red-500 text-2xl">
          <p>"Server Error, Please try again later"</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <article className="w-full group-expenses-page">
        <PageHeader currentPage={group?.user_group_name || "Group"} />
        <header className="group-page-heading"><p className="eyebrow">Shared expenses</p><h2>{group?.user_group_name || "Group"}</h2><p>{group?.user_group_email?.length ?? 0} members <span aria-hidden="true">·</span> Every shared moment, accounted for.</p></header>
        {balanceExpenses && <div className="group-contributions"><GroupContributionsCard groupName="Group contributions" contributions={contributions.map(data => ({ name: data.user_expense_name, amount: data.user_expense_amount }))} /></div>}
        <div className="mobile-balance-summary">
          <BalanceSummary />
        </div>
        <section className="expense-list-section"><div className="section-heading"><h2>Expenses</h2></div>
          <ExpenseList expenses={groupExpenses} groupId={id} isLoading={isLoading} emptyMessage="No expenses yet. Add the first one to get started." />
        </section>
        {pageError && <p role="alert">Unable to load more expenses. Please try again.</p>}
        {hasMore && <div className="pagination-actions">
          <Button
            variant="ghost"
            onClick={showMore}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Show more"}
          </Button>
        </div>}
      </article>{" "}
    </>
  );
}

export default Index;
