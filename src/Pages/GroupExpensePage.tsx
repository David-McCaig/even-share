import { useEffect } from "react";
import { useParams } from "react-router";
import { useFetchUserGroupQuery } from "../features/expensetable/expenseTableSlice";
import { useAppDispatch } from "../hooks/reduxTypeScriptHooks";
import { setGroupId } from "../features/expensetable/groupIdSlice";
import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTableRow from "../features/expensetable/Components/ExpenseTableRow";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
};

function GroupExpense() {
  const  id  = useParams<UrlParams>()?.id;
  console.log(typeof id)
  const { data } = useFetchUserGroupQuery(id);

  const dispatch = useAppDispatch();

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
            expenseDate={"March 28th 2023"}
            expenseAmount={expense.user_expense_amount}
            expenseId={expense.id}
          />
        </div>
      ))}
    </div>
  );
}

export default GroupExpense;
