import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useFetchUserGroupsQuery } from "../features/groupexpense/groupexpenseTableSlice";
import { useFetchRecentActivityQuery } from "../features/recentactivity/recentActivitySlice";
import { useLazyFetchRecentActivityPaginationQuery } from "../features/recentactivity/recentActivitySlice";
import { usePagination } from "../hooks/usePagination";
import ExpenseList from "../Components/ExpenseList";
import BalanceSummary from "../features/balancesummary/index";
import { Button } from "../Components/ui/button";

function RecentActivityPage() {
  const { email } = useAppSelector(selectUser);
  const { data: expenseGroup } = useFetchUserGroupsQuery(email);

  const {
    currentData: recentActivity,
    fulfilledTimeStamp,
    isLoading,
    isError: recentActivityisError,
    error: recentActivityError,
  } = useFetchRecentActivityQuery(email);

  const [fetchNextPage] = useLazyFetchRecentActivityPaginationQuery();
  const { expenses: expensesArray, hasMore, isFetching, error: pageError, showMore } = usePagination(
    email, recentActivity, request => fetchNextPage(request).unwrap(), fulfilledTimeStamp
  );

  //error handling
  if (recentActivityisError && expenseGroup?.length !== 0) {
    console.error(recentActivityError);
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-red-500 text-2xl">
          <p>"Server Error, Please try again later"</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full recent-activity-page">
      <header className="activity-page-heading"><p className="eyebrow">Your shared story</p><h1>Recent Activity</h1><p>A clear view of what’s been shared.</p></header>
      <ExpenseList expenses={expensesArray} showGroupName isLoading={isLoading} emptyMessage="Your shared expenses will appear here." />
      {pageError && <p role="alert">Unable to load more activity. Please try again.</p>}
      {hasMore && <div className="pagination-actions">
        <Button
          variant="ghost"
          onClick={showMore}
          disabled={isFetching}
        >
          {isFetching ? "Loading..." : "Show more"}
        </Button>
      </div>}
      <div className="mobile-balance-summary mt-7">
        <BalanceSummary />
      </div>
      <div className="h-4"></div>
    </section>
  );
}

export default RecentActivityPage;
