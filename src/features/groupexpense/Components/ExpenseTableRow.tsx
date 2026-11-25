import { MoreHorizontal } from "lucide-react";
import { useParams } from "react-router";
import { useDeleteExpenseGroupMutation } from "../groupexpenseTableSlice";
import { Button } from "../../../Components/ui/button";
import { useFetchUserGroupsQuery } from "../groupexpenseTableSlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../Components/ui/dropdown-menu";

interface ExpenseTableRowProps {
  expenseDescription: string;
  groupName?: string;
  settledUp?: boolean;
  expenseDate: string;
  expenseAmount: string;
  expenseId: string | undefined;
  billPaidBy: string | string[];
  expenseIcon: JSX.Element | string | undefined;
}

function ExpenseTableRow({
  expenseDescription,
  groupName,
  settledUp,
  expenseDate,
  expenseAmount,
  expenseId,
  billPaidBy,
  expenseIcon,
}: ExpenseTableRowProps) {
  const groupId = useParams()?.id;
  const userEmail = useAppSelector(selectUser)?.email;

  const {data:userExpenseGroups} = useFetchUserGroupsQuery(userEmail);
  const expenseGroupsArray = userExpenseGroups?.find((group) => group.id === groupId)?.user_group_email

  const [deleteExpense] = useDeleteExpenseGroupMutation();

  const deleteExpenseClick = async () => {
    deleteExpense({ groupId, expenseId, expenseGroupsArray });
  };

  return (
    <article className="expense-row">
      <span className="expense-icon" aria-hidden="true">{expenseIcon}</span>
      <div className="expense-description"><h3>{expenseDescription}</h3><p>{groupName && <><span className="expense-group-name">{groupName}</span> <span aria-hidden="true">·</span> </>}{billPaidBy} <span aria-hidden="true">·</span> {expenseDate}{settledUp && <> <span aria-hidden="true">·</span> Settled</>}</p></div>
      <strong className="expense-amount">{expenseAmount}</strong>
      {groupId && <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Actions for {expenseDescription}</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={deleteExpenseClick}>Delete</DropdownMenuItem><DropdownMenuItem>Update</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>}
    </article>
  );
}
export default ExpenseTableRow;
