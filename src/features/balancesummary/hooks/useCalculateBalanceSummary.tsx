import { useMemo } from "react";
import { createUserObject, calculateOwes, generateBalanceSummaryStatement } from "../../../utils/utils";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balanceSummarySlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";

export const useCalculateBalanceSummary = (id: string) => {
    const user = useAppSelector(selectUser);
    const { currentData: data, isFetching, isError } = useFetchExpensesForBalanceSummaryGroupQuery(id, { skip: !id });
    const { data: groups, isError: groupsError } = useFetchUserGroupsQuery(user.email);
    const group = groups?.find(group => group.id === id);
    return useMemo(() => {
        if (isError || groupsError) return { balanceArray: [], balanceError: "Unable to load this group’s balances.", isLoading: false };
        if (!data || !group || isFetching) return { balanceArray: [], balanceError: "", isLoading: true };
        try {
            const people = createUserObject(data, user.displayName || "", group.user_group_email, user.email);
            return { balanceArray: generateBalanceSummaryStatement(calculateOwes(people)), balanceError: "", isLoading: false };
        } catch (error) {
            return { balanceArray: [], balanceError: (error as Error).message, isLoading: false };
        }
    }, [data, group, isFetching, isError, groupsError, user.displayName, user.email]);
};
