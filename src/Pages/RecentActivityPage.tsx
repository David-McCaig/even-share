import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useFetchUserGroupsQuery } from "../features/groupexpense/groupexpenseTableSlice";
import { useFetchRecentActivityQuery } from "../features/recentactivity/recentActivitySlice";
import { useLazyFetchRecentActivityPaginationQuery } from "../features/recentactivity/recentActivitySlice";
import { usePagination } from "../hooks/usePagination";
import { selectExpenseIcon } from "../utils/selectExpenseIcon";
import { getFormattedDate } from "../utils/utils";
import ExpenseTableRow from "../features/groupexpense/Components/ExpenseTableRow";
import BalanceSummary from "../features/balancesummary/index";
import TopBar from "../Components/TopBar";
import { Button } from "../Components/ui/button";

function RecentActivityPage() {
  const { email, displayName } = useAppSelector(selectUser);
  const { data: expenseGroup } = useFetchUserGroupsQuery(email);

  const {
    currentData: recentActivity,
    isLoading,
    isError: recentActivityisError,
    error: recentActivityError,
  } = useFetchRecentActivityQuery(email);

  const [fetchNextPage] = useLazyFetchRecentActivityPaginationQuery();
  const { expenses: expensesArray, hasMore, isFetching, error: pageError, showMore } = usePagination(
    email, recentActivity, request => fetchNextPage(request).unwrap()
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
      <TopBar currentPage={"Recent Activity"} />
      <div className="mobile-balance-summary">
        <BalanceSummary />
      </div>
      <header className="activity-page-heading"><p className="eyebrow">Your shared story</p><h2>Recent Activity</h2><p>A clear view of what’s been shared.</p></header>
      <div className="expense-list">
      {expensesArray?.map((expense) => (
        <div key={expense?.id}>
          <ExpenseTableRow
            groupName={expense.user_group_name || "Group unavailable"}
            expenseIcon={selectExpenseIcon(expense?.user_expense_description)}
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(
              expense?.created_at?.seconds,
              expense?.created_at?.nanoseconds
            )}
            expenseAmount={`$${expense?.user_expense_amount.toFixed(2)}`}
            expenseId={expense?.id}
            billPaidBy={
              displayName === expense?.user_expense_name
                ? "You paid"
                : expense?.user_expense_name?.split(" ")?.slice(0, 1) + " paid"
            }
          />
        </div>
      ))}
      {!expensesArray?.length && <p className="empty-state" role="status">{isLoading ? "Loading activity…" : "Your shared expenses will appear here."}</p>}
      </div>
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
      <div className="h-4"></div>
    </section>
  );
}

export default RecentActivityPage;
