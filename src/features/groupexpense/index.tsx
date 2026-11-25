import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatchGroupID } from "../../features/groupexpense/hooks/useDispatchGroupID";
import { usePagination } from "../../hooks/usePagination";
import {
  useFetchExpensesForGroupQuery,
  useFetchUserGroupsQuery,
  useFetchPaginatedExpensesForGroupQuery,
} from "./groupexpenseTableSlice";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../features/authentication/userSlice";
import PieChart from "../dashboard/Components/PieChart";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balancesummary/balanceSummarySlice";
import { getFormattedDate, totalUserExpenses } from "../../utils/utils";
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
  const { data: groups } = useFetchUserGroupsQuery(user.email);
  const group = groups?.find(group => group.id === id);
  const { data: balanceExpenses } = useFetchExpensesForBalanceSummaryGroupQuery(id);
  const contributions = totalUserExpenses(balanceExpenses) || [];
  const [groupExpenses, setGroupExpenses] = useState<UserGroup[]>([]);
  useDispatchGroupID(id);

  const {
    data: groupExpensesData,
    isLoading,
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
      <article className="w-full group-expenses-page">
        <TopBar currentPage={group?.user_group_name || "Group"} />
        <header className="group-page-heading"><p className="eyebrow">Shared expenses</p><h2>{group?.user_group_name || "Group"}</h2><p>{group?.user_group_email?.length ?? 0} members <span aria-hidden="true">·</span> Every shared moment, accounted for.</p></header>
        {balanceExpenses && <div className="group-contributions"><PieChart groupName="Group contributions" chartData={{ labels: contributions.map(data => `${data.user_expense_name} $${data.user_expense_amount.toFixed(2)}`), datasets: [{ data: contributions.map(data => data.user_expense_amount) }] }} /></div>}
        <div className="mobile-balance-summary">
          <BalanceSummary />
        </div>
        <section className="expense-list-section"><div className="section-heading"><h2>Expenses</h2></div><div className="expense-list">
        {groupExpenses?.map((expense) => (
          <div key={expense.id}>
            <ExpenseTableRow
              expenseIcon={selectExpenseIcon(expense?.user_expense_description)}
              expenseDescription={expense?.user_expense_description}
              expenseDate={getFormattedDate(
                expense?.created_at?.seconds,
                expense?.created_at?.nanoseconds
              )}
              expenseAmount={`$${expense.user_expense_amount.toFixed(2)}`}
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
        {!groupExpenses?.length && <p className="empty-state" role="status">{isLoading ? "Loading expenses…" : "No expenses yet. Add the first one to get started."}</p>}
        </div></section>
        <div className="pagination-actions">
          <Button
            variant="ghost"
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
