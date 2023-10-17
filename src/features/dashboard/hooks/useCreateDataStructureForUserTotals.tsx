import { useState, useEffect } from "react";
import { totalUserExpenses } from "../../../utils/utils";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../../balancesummary/balanceSummarySlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { v4 as uuid } from "uuid"
import { UserGroupTotals } from "../../../types";



export const useCreateDataStructureForUserTotals = () => {
  const id = uuid();
  const [totalUserExpensesData, setTotalUserExpensesData] = useState<UserGroupTotals[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const user = useAppSelector(selectUser);
  const { data: userGroups } = useFetchUserGroupsQuery(user.email);
  const currentGroupId = userGroups?.[currentGroupIndex]?.id;
  const currentName = userGroups?.[currentGroupIndex]?.user_group_name || "";

  const { data } = useFetchExpensesForBalanceSummaryGroupQuery(currentGroupId);
  const totalExpenses = totalUserExpenses(data);

  useEffect(() => {
    setTotalUserExpensesData([]);
    setCurrentGroupIndex(0);
  }, []);

  useEffect(() => {
    if (totalExpenses && totalExpenses.length !== 0) {
      setTotalUserExpensesData((prev) => [
        ...prev,
        {
          id: id,
          user_group_name: currentName,
          user_group_totals: [...totalExpenses],
        },
      ]);
    }
    if (currentGroupIndex < (userGroups?.length || 0) - 1) {
      setCurrentGroupIndex((prev) => prev + 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  
  return { totalUserExpensesData };
};
