import { MoreHorizontal } from "lucide-react";
import { useParams } from "react-router";
import { useDeleteExpenseGroupMutation } from "../groupexpenseTableSlice";

import { Button } from "../../../Components/ui/button";
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
  expenseDate: string;
  expenseAmount: string;
  expenseId: string | undefined;
  billPaidBy: string | string[];
  expenseIcon: JSX.Element | string | undefined;
}

function ExpenseTableRow({
  expenseDescription,
  expenseDate,
  expenseAmount,
  expenseId,
  billPaidBy,
  expenseIcon,
}: ExpenseTableRowProps) {
  const groupId = useParams()?.id;

  const [deleteExpense] = useDeleteExpenseGroupMutation();

  const deleteExpenseClick = async () => {
    deleteExpense({ groupId, expenseId });
  };

  return (
    <div className="">
      <div className="pr-4 bg-primary-bg-color text-primary-font-color border shadow-md dark:bg-gray-800 dark:border-gray-700 ">
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0"></div>
                {expenseIcon}
                {/* <PoweroffOutlined className="text-xl" /> */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate dark:text-white">
                    {expenseDescription}
                  </p>
                  <p className="text-sm text-secondary-font-color truncate dark:text-gray-400">
                    {expenseDate}
                  </p>
                </div>
                <div className="w-20 flex flex-col text-base font-semibold dark:text-white">
                  <p className="text-secondary-font-color">{billPaidBy}</p>
                  <p>{expenseAmount}</p>
                </div>
                {groupId ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={deleteExpenseClick}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem>Update</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="w-4"></div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTableRow;
