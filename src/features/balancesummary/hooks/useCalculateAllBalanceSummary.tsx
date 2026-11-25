import { useEffect, useState } from "react";
import { createUserObject } from "../../../utils/utils";
import { calculateOwes } from "../../../utils/utils";
import { generateBalanceSummaryStatement } from "../../../utils/utils";
import { BalanceSummary } from "../../../types";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balanceSummarySlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";

export const useCalculateAllBalanceSummary = () => {
    const [allBalanceSummary, setAllBalanceSummary] = useState<BalanceSummary[]>([]);

    const [balanceErrors, setBalanceErrors] = useState<Record<string, string>>({});

    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    const user = useAppSelector(selectUser);
    const { data: userGroups } = useFetchUserGroupsQuery(user.email);
    const currentGroupId = userGroups?.[currentGroupIndex]?.id;
    const currentGroup = userGroups?.[currentGroupIndex];
    const currentName = currentGroup?.user_group_name;
    const { currentData: currentGroupExpenses } = useFetchExpensesForBalanceSummaryGroupQuery(currentGroupId, { skip: !currentGroupId });
    useEffect(() => {
        setAllBalanceSummary([]);
        setBalanceErrors({});
        setCurrentGroupIndex(0);
    }, [user.email]);

    useEffect(() => {
        if (currentGroupExpenses && currentGroupId && currentGroup) {
          try {
            const userObject = createUserObject(currentGroupExpenses, user.displayName || "", currentGroup.user_group_email, user.email);
            const result = calculateOwes(userObject);
            const balanceSummaryStatement = generateBalanceSummaryStatement(result, currentGroupId, currentName);
            setAllBalanceSummary((prevState) => [
                ...prevState.filter(balance => balance.sourceGroupId !== currentGroupId),
                ...balanceSummaryStatement.map(balance => ({ ...balance, sourceGroupId: currentGroupId })),
            ]);

            setBalanceErrors(previous => {
                const next = { ...previous };
                delete next[currentGroupId];
                return next;
            });
          } catch (error) {
            setAllBalanceSummary(previous => previous.filter(balance => balance.sourceGroupId !== currentGroupId));
            setBalanceErrors(previous => ({ ...previous, [currentGroupId]: `${currentName}: ${(error as Error).message}` }));
          }

            // Move to the next group
            if (currentGroupIndex < (userGroups?.length || 0) - 1) {
                setCurrentGroupIndex(prev => prev + 1);
            }
        }
    }, [currentGroupExpenses, currentGroupId, currentName, currentGroupIndex, userGroups?.length, currentGroup, user.displayName, user.email]);
    return { allBalanceSummary, balanceErrors };
};

