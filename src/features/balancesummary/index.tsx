import { useState } from "react";
import { useAppSelector } from "../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../authentication/userSlice";
import { useFetchUserGroupQuery } from "../groupexpense/groupExpenseTableSlice";
import BalanceSummaryColumn from "./Component/BalanceSummaryColumn";
import BalanceSummaryCard from "./Component/BalanceSummaryCard";
import { useEffect } from "react";
import { createUserObject } from "../../utils/utils";
import { calculateOwes } from "../../utils/utils";
import { generateBalanceSummaryStatement } from "../../utils/utils";
import { BalanceSummary } from "../../types";

function Index() {
  
  const [expensesArray, setExpensesArray] = useState<(string | BalanceSummary)[]>(
    []
  );
  const { groupId } = useAppSelector((state) => state.groupId.groupId);

  const user = useAppSelector(selectUser);
  const { data } = useFetchUserGroupQuery(groupId);

  useEffect(() => {
    if (data) {
      const userObject = createUserObject(data, user.displayName);
      const result = calculateOwes(userObject, user.displayName);
      const balanceSummaryStatement = generateBalanceSummaryStatement(result)
      setExpensesArray(balanceSummaryStatement as (string | BalanceSummary)[]);
      console.log(expensesArray)
    }
  }, [data]);

  return (
    <>
      <BalanceSummaryColumn>
        {expensesArray?.map((expense, i) => (
          <BalanceSummaryCard
            key={i}
            userName={
              typeof expense === "string" ? expense : expense.userString
            }
            userAmount={
              typeof expense === "string" ? 0 : expense.userNumber || 0
            }
          />
        ))}
      </BalanceSummaryColumn>
    </>
  );
}

export default Index;
