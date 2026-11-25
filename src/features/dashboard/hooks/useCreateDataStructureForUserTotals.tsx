import { useState, useEffect } from "react";
import { totalUserExpenses } from "../../../utils/utils";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../../balancesummary/balanceSummarySlice";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { UserGroupTotals } from "../../../types";

export const useCreateDataStructureForUserTotals = () => {
  const [totalUserExpensesData, setTotalUserExpensesData] = useState<UserGroupTotals[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const user = useAppSelector(selectUser);
  const { data: userGroups } = useFetchUserGroupsQuery(user.email);
  const currentGroupId = userGroups?.[currentGroupIndex]?.id;
  const currentName = userGroups?.[currentGroupIndex]?.user_group_name || "";
  const { currentData: data } = useFetchExpensesForBalanceSummaryGroupQuery(currentGroupId, { skip: !currentGroupId });

  useEffect(() => {
    setTotalUserExpensesData([]);
    setCurrentGroupIndex(0);
  }, [user.email]);

  useEffect(() => {
    // Wait for this group's data before advancing, including groups with no expenses.
    if (!data || !currentGroupId) return;
    setTotalUserExpensesData(previous => [
      ...previous.filter(group => group.id !== currentGroupId),
      { id: currentGroupId, user_group_name: currentName, user_group_totals: totalUserExpenses(data) },
    ]);
    if (currentGroupIndex < (userGroups?.length || 0) - 1) {
      setCurrentGroupIndex(previous => previous + 1);
    }
  }, [data, currentGroupId, currentName, currentGroupIndex, userGroups?.length]);

  return { totalUserExpensesData };
};
