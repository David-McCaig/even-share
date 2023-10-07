import { useEffect } from "react";
import { createUserObject } from "../../../../utils/utils";
import { calculateOwes } from "../../../../utils/utils";
import {}

export const useCalculateBalanceSummary = () => {
    useEffect(() => {
          const userObject = createUserObject(data, user.displayName);
          const result = calculateOwes(userObject, user.displayName);
          const balanceSummaryStatement = generateBalanceSummaryStatement(result)
          setBalanceArray(balanceSummaryStatement as (string | BalanceSummary)[]);
      }, [data, user.displayName]);
}

