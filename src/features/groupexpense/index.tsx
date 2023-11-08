import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatchGroupID } from "../../features/groupexpense/hooks/useDispatchGroupID";
import { usePagination } from "../../hooks/usePagination";
import {
  useFetchExpensesForGroupQuery,
  useFetchPaginatedExpensesForGroupQuery,
} from "./groupexpenseTableSlice";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../features/authentication/userSlice";
import { getFormattedDate } from "../../utils/utils";
import { selectExpenseIcon } from "../../utils/selectExpenseIcon";
import { Button } from "../../Components/ui/button";
import TopBar from "../../Components/TopBar";
import BalanceSummary from "../../features/balancesummary/index";
import ExpenseTableRow from "../../features/groupexpense/Components/ExpenseTableRow";
import { UserGroup } from "../../types";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
};

function Index() {
  const id = useParams<UrlParams>()?.id;
  const user = useAppSelector(selectUser);
  const [groupExpenses, setGroupExpenses] = useState<UserGroup[]>([]);
  useDispatchGroupID(id);

  const {
    data: groupExpensesData,
    refetch,
    isError: expensesIsError,
    error: expensesError,
  } = useFetchExpensesForGroupQuery(id);

  const {
    data: nextGroupExpenses,
    refetch: fetchNextPage,
    isFetching,
    isError: nextExpenseIsError,
    error: nextExpenseError,
  } = useFetchPaginatedExpensesForGroupQuery(id);

  useEffect(() => {
    if (groupExpensesData) {
      setGroupExpenses(groupExpensesData);
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, groupExpensesData]);

  // Handler for clicking the "Show more" button
  const showMoreClick = () => {
    fetchNextPage();
  };
  // Custom hook for handling pagination
  usePagination(nextGroupExpenses || [], setGroupExpenses);

  if (expensesIsError || nextExpenseIsError) {
    console.error(expensesError || nextExpenseError);
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
      <article className="w-full">
        <TopBar currentPage={"Group"} />
        <div className="lg:hidden">
          <BalanceSummary />
        </div>
        {groupExpenses?.map((expense) => (
          <div key={expense.id}>
            <ExpenseTableRow
              expenseIcon={selectExpenseIcon(expense?.user_expense_description)}
              expenseDescription={expense?.user_expense_description}
              expenseDate={getFormattedDate(
                expense?.created_at?.seconds,
                expense?.created_at?.nanoseconds
              )}
              expenseAmount={`$${expense.user_expense_amount}`}
              expenseId={expense.id}
              billPaidBy={
                user.displayName === expense?.user_expense_name
                  ? "You paid"
                  : expense?.user_expense_name?.split(" ")?.slice(0, 1) +
                    " paid"
              }
            />
          </div>
        ))}
        <div className="w-full flex justify-center mt-4">
          <Button
            className="bg-gray-200 w-40 text-black hover:bg-gray-300 "
            onClick={showMoreClick}
          >
            {isFetching ? "Loading..." : "Show more"}
          </Button>
        </div>
      </article>{" "}
    </>
  );
}

export default Index;
