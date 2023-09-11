import { useParams } from "react-router";
import TopBar from "../Components/TopBar";
import BalanceSummaryCard from "../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTableRow from "../features/expensetable/Components/ExpenseTableRow";
import { useFetchUserGroupQuery } from "../features/expensetable/expenseTableSlice";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
}

function GroupExpense() {
  const { id } = useParams<UrlParams>();

  const { data } = useFetchUserGroupQuery(id);

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
        <BalanceSummaryCard />
      </div>
      {data?.map((expense) => (
        <div key={expense.id}>
          <ExpenseTableRow
            billDescription={expense?.user_expense_description}
            billDate={"March 28th 2023"}
            billAmount={expense.user_expense_amount}
          />
        </div>
      ))}
    </div>
  );
}

export default GroupExpense;
