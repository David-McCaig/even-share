import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useFetchUserGroupsQuery } from "../features/groupexpense/groupexpenseTableSlice";
import { useFetchRecentActivityQuery } from "../features/recentactivity/recentActivitySlice";
import { useFetchRecentActivityPaginationQuery } from "../features/recentactivity/recentActivitySlice";
import { usePagination } from "../hooks/usePagination";
import { selectExpenseIcon } from "../utils/selectExpenseIcon";
import { getFormattedDate } from "../utils/utils";
import { UserGroup } from "../types";
import ExpenseTableRow from "../features/groupexpense/Components/ExpenseTableRow";
import BalanceSummary from "../features/balancesummary/index";
import TopBar from "../Components/TopBar";
import { Button } from "../Components/ui/button";

function RecentActivityPage() {
  const { email, displayName } = useAppSelector(selectUser);
  const { data: groupId } = useFetchUserGroupsQuery(email);

  const [expensesArray, setExpensesArray] = useState<UserGroup[]>([]);

  const {
    data: recentActivity,
    refetch: refetchRecentActivity,
    isError: recentActivityisError,
    error: recentActivityError,
  } = useFetchRecentActivityQuery(email);

  const {
    data: recentActivityPagination,
    refetch: paginationFetch,
    isFetching,
    isError: paginationisError,
    error: paginationError,
  } = useFetchRecentActivityPaginationQuery(email);

  useEffect(() => {
    if (recentActivity) {
      setExpensesArray(recentActivity);
      refetchRecentActivity();
    }
  }, [groupId, recentActivity, refetchRecentActivity]);

  const nextPageClick = async () => {
    paginationFetch();
  };

  //custom hook for pagination
  usePagination(recentActivityPagination || [], setExpensesArray);

  //error handling
  if (recentActivityisError || paginationisError) {
    console.error(recentActivityError || paginationError);
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-red-500 text-2xl">
          <p>"Server Error, Please try again later"</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      <TopBar currentPage={"Recent Activity"} />
      <div className="lg:hidden">
        <BalanceSummary />
      </div>
      {expensesArray?.map((expense) => (
        <div key={expense.id}>
          <ExpenseTableRow
            expenseIcon={selectExpenseIcon(expense?.user_expense_description)}
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(
              expense?.created_at?.seconds,
              expense?.created_at?.nanoseconds
            )}
            expenseAmount={`$${expense?.user_expense_amount}`}
            expenseId={expense?.id}
            billPaidBy={
              displayName === expense?.user_expense_name
                ? "You paid"
                : expense?.user_expense_name?.split(" ")?.slice(0, 1) + " paid"
            }
          />
        </div>
      ))}
      <div className="w-full flex justify-center mt-4">
        <Button
          className="bg-gray-200 w-40 text-black hover:bg-gray-300"
          onClick={nextPageClick}
        >
          {isFetching ? "Loading..." : "Show more"}
        </Button>
      </div>
      <div className="h-4"></div>
    </section>
  );
}

export default RecentActivityPage;
