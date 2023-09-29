import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import { useFetchUserGroupsQuery } from "../features/expensetable/expenseTableSlice";
import {
  collection,
  query,
  getDocs,
  limit,
  startAfter,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../utils/firebaseconfig";
import ExpenseTableRow from "../features/expensetable/Components/ExpenseTableRow";
import {
  PoweroffOutlined,
  WifiOutlined,
  CarOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getFormattedDate } from "../utils";
import { UserGroups, UserGroup } from "../types";

function RecentActivityPage() {
  const { email, displayName } = useAppSelector(selectUser);
  const { data: groupId } = useFetchUserGroupsQuery(email);
  console.log(groupId)
  const [expensesArray, setExpensesArray] = useState<UserGroup[]>([]);

  const [indexUserGroupId, setIndexUserGroupId] = useState(0);
  const [pagination, setPagination] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  console.log(indexUserGroupId);

  useEffect(() => {
    getData();
  }, [groupId]);

  const getData = async () => {
    if (!groupId) {
      return;
    }
    const first = query(
      collection(
        db,
        `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
      ),
      orderBy("created_at"),
      limit(3)
    );
    const querySnapshot = await getDocs(first);
    setPagination(querySnapshot.docs[querySnapshot.docs.length - 1]);
    console.log(querySnapshot.docs.length);
    const expenseArray: UserGroups = [];
    querySnapshot?.forEach((doc) => {
      expenseArray.push({ id: doc.id, ...doc.data() } as UserGroup);
    });
    setExpensesArray(expenseArray);
  };

  const nextPageClick = async () => {
    const next = query(
      collection(
        db,
        `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
      ),
      orderBy("created_at"),
      startAfter(pagination!),
      limit(3)
    );
    const querySnapshot = await getDocs(next);
  
    if (
      querySnapshot.docs.length === 0 &&
      indexUserGroupId < (groupId?.length || 0) - 1 
    ) {
      // No more expenses in the current user group. Move to the next group.
      setIndexUserGroupId((prevIndex) => prevIndex + 1);
      setPagination(null); // Reset pagination for the new group.
  
      // Fetch the expenses for the next user group immediately.
      const nextGroup = query(
        collection(
          db,
          `userGroups/${groupId?.[indexUserGroupId + 1]?.id}/expenses`
        ),
        orderBy("created_at"),
        limit(3)
      );
      const nextGroupSnapshot = await getDocs(nextGroup);
  
      const nextExpenseArray: UserGroups = [];
      nextGroupSnapshot.forEach((doc) => {
        nextExpenseArray.push({ id: doc.id, ...doc.data() } as UserGroup);
      });
  
      setExpensesArray((prevExpensesArray: UserGroup[]) => [
        ...prevExpensesArray,
        ...nextExpenseArray,
      ]);
  
      setPagination(
        nextGroupSnapshot.docs[nextGroupSnapshot.docs.length - 1] || null
      );
    } else {
      setPagination(querySnapshot.docs[querySnapshot.docs.length - 1]);
      const expenseArray: UserGroups = [];
      querySnapshot.forEach((doc) => {
        expenseArray.push({ id: doc.id, ...doc.data() } as UserGroup);
      });
      setExpensesArray((prevExpensesArray: UserGroup[]) => [
        ...prevExpensesArray,
        ...expenseArray,
      ]);
    }
  };

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
    } else {
      return <FileTextOutlined className="text-xl" />;
    }
  };

  return (
    <div className="w-full">
      {expensesArray?.map((expense, i) => (
        <div key={i}>
          <ExpenseTableRow
            expenseIcon={selectIcon(expense?.user_expense_description)}
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(
              expense?.created_at?.seconds,
              expense?.created_at?.nanoseconds
            )}
            expenseAmount={`$${expense?.user_expense_amount}`}
            expenseId={expense?.id}
            billPaidBy={
              displayName === expense?.user_expense_name
                ? "You paid"
                : expense?.user_expense_name?.split(" ")?.slice(0, 1) + " paid"
            }
          />
        </div>
      ))}
      <button
        className="w-full text-center text-blue-500 font-semibold"
        onClick={nextPageClick}
      >
        click me
      </button>
    </div>
  );
}

export default RecentActivityPage;
