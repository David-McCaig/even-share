import { useMemo } from "react";
import { createUserObject, calculateOwes, generateBalanceSummaryStatement } from "../../../utils/utils";
import type { BalanceSummary } from "../../../types";
import { useGroupExpenses } from "./useGroupExpenses";

export const useCalculateAllBalanceSummary = () => {
  const { user, groups, queries } = useGroupExpenses();
  return useMemo(() => {
    const allBalanceSummary: BalanceSummary[] = [];
    const balanceErrors: Record<string, string> = {};
    groups?.forEach((group, index) => {
      const result = queries[index];
      if (result?.isError) {
        balanceErrors[group.id] = `${group.user_group_name}: Unable to load balances.`;
        return;
      }
      if (!result?.data) return;
      try {
        const people = createUserObject(result.data, user.displayName || "", group.user_group_email, user.email);
        allBalanceSummary.push(...generateBalanceSummaryStatement(calculateOwes(people), group.id, group.user_group_name)
          .map(balance => ({ ...balance, sourceGroupId: group.id })));
      } catch (error) {
        balanceErrors[group.id] = `${group.user_group_name}: ${(error as Error).message}`;
      }
    });
    return { allBalanceSummary, balanceErrors };
  }, [groups, queries, user.displayName, user.email]);
};
