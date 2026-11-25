import { useMemo } from "react";
import { totalUserExpenses } from "../../../utils/utils";
import { useGroupExpenses } from "../../balancesummary/hooks/useGroupExpenses";

export const useCreateDataStructureForUserTotals = () => {
  const { groups, queries } = useGroupExpenses();
  const totalUserExpensesData = useMemo(() => groups?.map((group, index) => ({
    id: group.id,
    user_group_name: group.user_group_name,
    user_group_totals: totalUserExpenses(queries[index]?.data) ?? [],
  })) ?? [], [groups, queries]);
  return { totalUserExpensesData };
};
