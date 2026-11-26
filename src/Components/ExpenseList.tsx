import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useDeleteExpenseGroupMutation, useFetchUserGroupsQuery } from "../features/groupexpense/groupexpenseTableSlice";
import ExpenseTableRow from "../features/groupexpense/Components/ExpenseTableRow";
import type { UserGroup } from "../types";

interface ExpenseListProps {
  expenses: UserGroup[];
  groupId?: string;
  showGroupName?: boolean;
  isLoading?: boolean;
  emptyMessage: string;
  className?: string;
}

export default function ExpenseList({ expenses, groupId, showGroupName = false, isLoading = false, emptyMessage, className = "expense-list" }: ExpenseListProps) {
  const user = useAppSelector(selectUser);
  const { data: groups } = useFetchUserGroupsQuery(user.email);
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseGroupMutation();

  return <div className={`shared-expense-list ${className}`}>
    {expenses.map(expense => {
      const sourceGroupId = groupId ?? expense.user_group_id;
      const group = groups?.find(group => group.id === sourceGroupId);
      const paidByYou = expense.user_expense_email
        ? expense.user_expense_email.trim().toLowerCase() === user.email.trim().toLowerCase()
        : expense.user_expense_name === user.displayName;
      return <ExpenseTableRow
        key={`${sourceGroupId}-${expense.id}`}
        expense={expense}
        groupName={showGroupName ? group?.user_group_name || expense.user_group_name || "Group unavailable" : undefined}
        paidBy={paidByYou ? "You paid" : `${expense.user_expense_name} paid`}
        isDeleting={isDeleting}
        onDelete={group && expense.settled_up === false ? () => {
          void deleteExpense({ groupId: group.id, expenseId: expense.id, expenseGroupsArray: group.user_group_email });
        } : undefined}
      />;
    })}
    {!expenses.length && <p className="empty-state" role="status">{isLoading ? "Loading expenses…" : emptyMessage}</p>}
  </div>;
}
