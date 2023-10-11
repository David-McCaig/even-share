import { useEffect } from "react";
import { UserGroup } from "../../../types";


export const usePagination = (nextGroupExpenses: UserGroup[], setNextGroupExpenses: React.Dispatch<React.SetStateAction<UserGroup[]>>) => {
    useEffect(() => {
        if (nextGroupExpenses) {
            setNextGroupExpenses((prevExpense: UserGroup[]) => [...prevExpense, ...nextGroupExpenses]);
        }
    }, [nextGroupExpenses, setNextGroupExpenses]);
}