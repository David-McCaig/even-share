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

    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    const user = useAppSelector(selectUser);
    const { data: userGroups } = useFetchUserGroupsQuery(user.email);
    const currentGroupId = userGroups?.[currentGroupIndex]?.id;
    const currentName = userGroups?.[currentGroupIndex]?.user_group_name;
    const { currentData: currentGroupExpenses } = useFetchExpensesForBalanceSummaryGroupQuery(currentGroupId, { skip: !currentGroupId });
    useEffect(() => {
        setAllBalanceSummary([]);
        setCurrentGroupIndex(0);
    }, [user.email]);

    useEffect(() => {
        if (currentGroupExpenses && currentGroupId) {
            const userObject = createUserObject(currentGroupExpenses, user.displayName);
            const result = calculateOwes(userObject, user.displayName);
            const balanceSummaryStatement = generateBalanceSummaryStatement(result, currentGroupId, currentName);
            setAllBalanceSummary((prevState) => [
                ...prevState.filter(balance => balance.sourceGroupId !== currentGroupId),
                ...balanceSummaryStatement.map(balance => ({ ...balance, sourceGroupId: currentGroupId })),
            ]);

            // Move to the next group
            if (currentGroupIndex < (userGroups?.length || 0) - 1) {
                setCurrentGroupIndex(prev => prev + 1);
            }
        }
    }, [currentGroupExpenses, currentGroupId, currentName, currentGroupIndex, userGroups?.length, user.displayName]);
    return { allBalanceSummary };
};

