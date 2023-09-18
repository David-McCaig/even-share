import { useEffect } from "react";
import { useParams } from "react-router";
import { useFetchUserGroupQuery } from "../features/expensetable/expenseTableSlice";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useAppDispatch } from "../hooks/reduxTypeScriptHooks";
import { setGroupId } from "../features/expensetable/groupIdSlice";
import { getFormattedDate } from "../utils";
import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTableRow from "../features/expensetable/Components/ExpenseTableRow";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
};


function GroupExpense() {
  const  id  = useParams<UrlParams>()?.id;
  const { data } = useFetchUserGroupQuery(id);

  // getFormattedDate()
  const { displayName } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  console.log(displayName)
  useEffect(() => {
  dispatch(
    setGroupId({
      groupId: id,
    })
  );
},[dispatch, id])

  const AddExpenseClick = () => {};

  const AddSettleUpClick = () => {};

  return (
    <div className="w-full">
      <TopBar
        currentPage={"Dashboard"}
        AddExpenseClick={AddExpenseClick}
        AddSettleUpClick={AddSettleUpClick}
      />
      <div className="lg:hidden">
        <BalanceSummaryCard userName={"feffe"} userAmount={"fefe"} />
      </div>
      {data?.map((expense) => (
        <div key={expense.id}>
          <ExpenseTableRow
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(expense?.created_at?.seconds, expense?.created_at?.nanoseconds)}
            expenseAmount={`$${expense.user_expense_amount}`}
            expenseId={expense.id}
            billPaidBy={displayName === expense.user_expense_name ? "You paid" : expense.user_expense_name.split(" ").slice(0, 1)}
          />
        </div>
      ))}
    </div>
  );
}

export default GroupExpense;
