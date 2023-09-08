// src/features/scores/scoresSlice.ts
import { firestoreApi } from "../../firestoreApi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { query, where } from "firebase/firestore";

interface UserGroup {
  id: string | undefined;
  user_group_id: string;
  user_group_name: string;
  user_expense_description: string;
  user_expense_amount: string;
}

type UserGroups = UserGroup[];

export const scoresApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserGroups: builder.query<UserGroups, void>({
      async queryFn(userEmail) {
        try {
          const userGroupRef = collection(db, "userGroups");
          const queryGroupByEmail = query(
            userGroupRef,
            where("user_group_email", "array-contains", userEmail)
          );
          const querySnapshot = await getDocs(queryGroupByEmail);
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            userGroups.push({ id: doc.id, ...doc.data() } as UserGroup);
          });
          return { data: userGroups };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Score"],
    }),
    fetchUserGroup: builder.query<UserGroups, void>({
      async queryFn(urlId) {
        try {
          const billQuery = query(
            collection(db, `userGroups/${urlId}/expenses`)
          );
          const querySnapshot = await getDocs(billQuery);
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            userGroups.push({ id: doc.id, ...doc.data() } as UserGroup);
          });
          return { data: userGroups };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Score"],
    }),
  }),
});

export const { useFetchUserGroupsQuery, useFetchUserGroupQuery } = scoresApi;
