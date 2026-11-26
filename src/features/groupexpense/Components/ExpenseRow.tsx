import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../../../Components/ui/button";
import { getFormattedDate } from "../../../utils/utils";
import { selectExpenseIcon } from "../../../utils/selectExpenseIcon";
import type { UserGroup } from "../../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../Components/ui/dropdown-menu";

interface ExpenseRowProps {
  expense: UserGroup;
  groupName?: string;
  paidBy: string;
  onDelete?: () => void;
  isDeleting: boolean;
}

function ExpenseRow({
  expense,
  groupName,
  paidBy,
  onDelete,
  isDeleting,
}: ExpenseRowProps) {
  return (
    <article className="expense-row">
      <span className="expense-icon" aria-hidden="true">{selectExpenseIcon(expense.user_expense_description)}</span>
      <div className="expense-description"><h3>{expense.user_expense_description}</h3><p>{groupName && <><span className="expense-group-name">{groupName}</span> <span aria-hidden="true">·</span> </>}{paidBy} <span aria-hidden="true">·</span> {getFormattedDate(expense.created_at.seconds, expense.created_at.nanoseconds)}{expense.settled_up && <span className="expense-settled-pill">Settled</span>}</p></div>
      <strong className="expense-amount">${expense.user_expense_amount.toFixed(2)}</strong>
      <div className="expense-actions">
      {expense.settled_up === false && onDelete && <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}><span className="sr-only">Actions for {expense.user_expense_description}</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end"><DropdownMenuItem disabled={isDeleting} onSelect={onDelete}><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Delete</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>}
      </div>
    </article>
  );
}
export default ExpenseRow;
