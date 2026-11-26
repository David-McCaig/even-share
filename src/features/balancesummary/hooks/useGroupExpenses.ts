import { useEffect, useMemo } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { recentActivityApi as balanceApi } from "../balanceSummarySlice";

// Keep every group's existing query subscribed so invalidation updates all summaries.
export function useGroupExpenses() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { currentData: groups } = useFetchUserGroupsQuery(user.email);
  const ids = useMemo(() => groups?.map(group => group.id) ?? [], [groups]);
  const selectQueries = useMemo(() => createSelector(
    ids.map(id => balanceApi.endpoints.fetchExpensesForBalanceSummaryGroup.select(id)),
    (...queries) => queries,
  ), [ids]);
  const queries = useAppSelector(selectQueries);

  useEffect(() => {
    const subscriptions = ids.map(id => dispatch(balanceApi.endpoints.fetchExpensesForBalanceSummaryGroup.initiate(id)));
    return () => subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [dispatch, ids]);

  return { user, groups, queries };
}
