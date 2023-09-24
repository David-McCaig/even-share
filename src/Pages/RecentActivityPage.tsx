import { useState } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import React, { useEffect } from "react";
import { db } from "../utils/firebaseconfig";
import { useAppSelector } from "../hooks/reduxTypeScriptHooks";
import { selectUser } from "../features/authentication/userSlice";
import ExpenseTableRow from "../features/expensetable/Components/ExpenseTableRow";
import { PoweroffOutlined, WifiOutlined, CarOutlined, PhoneOutlined,FileTextOutlined  } from "@ant-design/icons";
import { getFormattedDate } from "../utils";
import { useFetchUserExpensesQuery } from "../features/expensetable/expenseTableSlice";


function RecentActivityPage() {
  const { email, displayName } = useAppSelector(selectUser);

  const [expensesArray, setExpensesArray] = useState([]);
  const { data } = useFetchUserExpensesQuery(email);
  console.log(data)
  
  useEffect(() => {
    setExpensesArray(data);
    // const fetchData = async () => {  
    //   const expensesArray = [];
    //     const userGroupRef = collection(db, "userGroups");
    //     const queryGroupByEmail = query(
    //       userGroupRef,
    //       where("user_group_email", "array-contains", email)
    //     );
    //     const querySnapshot = await getDocs(queryGroupByEmail) ;
          
    //     querySnapshot.forEach(async (doc) => {
    //       const expensesCollectionRef = collection(doc.ref, "expenses");
    //       const expensesSnapshot = await getDocs(expensesCollectionRef);
  
    //       expensesSnapshot.forEach((expenseDoc) => {
           
    //         expensesArray.push(expenseDoc.data());
            
    //       });
    //       setExpensesArray(expensesArray);
    //     });
    // };
    // fetchData();
  }, [data]);

  const selectIcon = (billType: JSX.Element | string) => {
    const billTypeString = typeof billType === 'string' ? billType : billType.toString();
  
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
      {expensesArray?.map((expense,i) => (
        <>
          <ExpenseTableRow
            expenseIcon={selectIcon(expense?.user_expense_description)}
            expenseDescription={expense?.user_expense_description}
            expenseDate={getFormattedDate(expense?.created_at?.seconds, expense?.created_at?.nanoseconds)}
            expenseAmount={`$${expense.user_expense_amount}`}
            expenseId={expense.id}
            billPaidBy={displayName === expense?.user_expense_name ? "You paid" : expense?.user_expense_name?.split(" ")?.slice(0, 1) + " paid"}
          />
        </>
      ))}
    </div>
  );
}

export default RecentActivityPage;
