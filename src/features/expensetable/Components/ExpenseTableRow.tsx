import { PoweroffOutlined } from "@ant-design/icons";
import { Button } from "../../../Components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../Components/ui/dropdown-menu";

interface ExpenseTableRowProps {
    billDescription: string
    billDate: string
    billAmount: string
}

function ExpenseTableRow({ billDescription,billDate,billAmount }: ExpenseTableRowProps) {
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
                <PoweroffOutlined className="text-xl" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate dark:text-white">
                    {billDescription}
                  </p>
                  <p className="text-sm text-secondary-font-color truncate dark:text-gray-400">
                    {billDate}
                  </p>
                </div>
                <div className="flex flex-col text-base font-semibold dark:text-white">
                  <p className="text-secondary-font-color">You paid</p>
                  <p>{billAmount}</p>
                </div>
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
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    <DropdownMenuItem>Update</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTableRow;
