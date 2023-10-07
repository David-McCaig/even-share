import { useAppSelector } from "./reduxTypeScriptHooks"
import { collection, where, query } from "firebase/firestore"
import { db } from "../firebase/firebaseconfig"
import { selectUser } from "../features/authentication/userSlice"



export const useQueryGroupByEmail = () => {
    const userInfo = useAppSelector(selectUser)
    const userGroupRef = collection(db, "userGroups");
    const q = query(userGroupRef, where("user_group_email", "array-contains", userInfo.email));
    return { q }
}