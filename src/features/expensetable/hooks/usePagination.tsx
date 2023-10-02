import { useEffect } from "react";
import { UserGroup } from "../../../types";


export const usePagination = (nextExpenseArray: UserGroup[], setExpensesArray: React.Dispatch<React.SetStateAction<UserGroup[]>>) => {
    useEffect(() => {
        if (nextExpenseArray) {
            setExpensesArray((prevExpense: UserGroup[]) => [...prevExpense, ...nextExpenseArray]);
        }
    }, [nextExpenseArray, setExpensesArray]);
}