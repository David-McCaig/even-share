import { useEffect, useState } from "react";
import { createUserObject } from "../../../utils/utils";
import { calculateOwes } from "../../../utils/utils";
import { generateBalanceSummaryStatement } from "../../../utils/utils";
import { BalanceSummary } from "../../../types";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { useFetchExpensesForBalanceSummaryGroupQuery } from "../balanceSummarySlice";

export const useCalculateBalanceSummary = (id:string) => {
    const [balanceArray, setBalanceArray] = useState<(string | BalanceSummary)[]>([]);
    const { data } = useFetchExpensesForBalanceSummaryGroupQuery(id);
    const user = useAppSelector(selectUser);
    useEffect(() => {
        if(data) {
            const userObject = createUserObject(data, user.displayName);
            const result = calculateOwes(userObject, user.displayName);
            const balanceSummaryStatement = generateBalanceSummaryStatement(result)
            setBalanceArray(balanceSummaryStatement as (string | BalanceSummary)[]);
        }
      }, [data, user.displayName]);
    return { balanceArray }
}

