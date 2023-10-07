import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatchGroupID } from "../../features/groupexpense/hooks/useDispatchGroupID";
import { usePagination } from "../../features/groupexpense/hooks/usePagination";
import {
  useFetchUserGroupQuery,
  useFetchUserGroupPaginationQuery,
} from "./groupExpenseTableSlice";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../features/authentication/userSlice";
import { getFormattedDate } from "../../utils";
import {
  PoweroffOutlined,
  WifiOutlined,
  CarOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button } from "../../Components/ui/button";
import TopBar from "../../Components/TopBar";
import BalanceSummaryCard from "../../features/balancesummary/Component/BalanceSummaryCard";
import ExpenseTableRow from "../../features/groupexpense/Components/ExpenseTableRow";
import { UserGroup } from "../../types";

type UrlParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
};

function Index() {
  const id = useParams<UrlParams>()?.id;
  const { data, refetch } = useFetchUserGroupQuery(id);

  const { displayName } = useAppSelector(selectUser);
  const [expensesArray, setExpensesArray] = useState<UserGroup[]>([]);

  useDispatchGroupID(id);

  useEffect(() => {
    if (data) {
      setExpensesArray(data);
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, data]);

  const { data: nextExpenseArray, refetch: fetchNextPage } =
    useFetchUserGroupPaginationQuery(id);

  const nextPageClick = () => {
    fetchNextPage();
  };

  usePagination(nextExpenseArray || [], setExpensesArray);

  const selectIcon = (billType: JSX.Element | string) => {
    const billTypeString =
      typeof billType === "string" ? billType : billType?.toString();

    if (billTypeString.split(" ")[0].toLowerCase() === "power") {
      return <PoweroffOutlined className="text-xl" />;
    } else if (billTypeString.split(" ")[0].toLowerCase() === "internet") {
      return <WifiOutlined className="text-xl" />;
    } else if (billTypeString.split(" ")[0].toLowerCase() === "car") {
      return <CarOutlined className="text-xl" />;
    } else if (billTypeString.split(" ")[0].toLowerCase() === "phone") {
      return <PhoneOutlined className="text-xl" />;
    } else if (billTypeString.split(" ")[0].toLowerCase() === "parking") {
      return <FileTextOutlined className="text-xl" />;
    }
  };
  return (
    <>
    <div className="w-full">
      <TopBar currentPage={"Dashboard"} />
      <div className="lg:hidden">
        <BalanceSummaryCard userName={"feffe"} userAmount={20} />
      </div>
      {expensesArray?.map((expense) => (
        <div key={expense.id}>
          <ExpenseTableRow
            expenseIcon={selectIcon(expense?.user_expense_description)}
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(
              expense?.created_at?.seconds,
              expense?.created_at?.nanoseconds
            )}
            expenseAmount={`$${expense.user_expense_amount}`}
            expenseId={expense.id}
            billPaidBy={
              displayName === expense?.user_expense_name
                ? "You paid"
                : expense?.user_expense_name?.split(" ")?.slice(0, 1) + " paid"
            }
          />
        </div>
      ))}
      <div className="w-full flex justify-center mt-4">
        <Button className="bg-gray-200 w-40 text-black hover:bg-gray-300 " onClick={nextPageClick}>
          Show more
        </Button>
      </div>
    </div>    </>
  )
}

export default Index