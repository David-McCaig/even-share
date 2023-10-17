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
    const [allBalanceSummary, setAllBalanceSummary] = useState<(BalanceSummary)[]>([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    const user = useAppSelector(selectUser);
    const { data: userGroups } = useFetchUserGroupsQuery(user.email);
    const currentGroupId = userGroups?.[currentGroupIndex]?.id;
    const currentName = userGroups?.[currentGroupIndex]?.user_group_name;
    const { data: currentGroupExpenses } = useFetchExpensesForBalanceSummaryGroupQuery(currentGroupId);
    console.log(currentGroupExpenses)
    useEffect(() => {
        setAllBalanceSummary([]);
        setCurrentGroupIndex(0);
    }, []); 

    useEffect(() => {
        if (currentGroupExpenses) {
            const userObject = createUserObject(currentGroupExpenses, user.displayName);
            const result = calculateOwes(userObject, user.displayName);
            const balanceSummaryStatement = generateBalanceSummaryStatement(result, currentGroupId, currentName);
            setAllBalanceSummary(prev => [...prev, ...balanceSummaryStatement]);
            // Move to the next group
            if (currentGroupIndex < (userGroups?.length || 0) - 1) {
                setCurrentGroupIndex(prev => prev + 1);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentGroupExpenses]);
    return { allBalanceSummary };
};

