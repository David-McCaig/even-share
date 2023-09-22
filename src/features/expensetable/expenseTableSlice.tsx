import { firestoreApi } from "../../firestoreApi";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { query, where } from "firebase/firestore";

interface UserGroup {
  id: string;
  user_group_id: string;
  user_group_name: string;
  user_expense_description: string;
  user_expense_amount: number;
  user_expense_name: string;
  created_at: {
    nanoseconds: number;
    seconds: number;
  };
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
    fetchUserGroup: builder.query<UserGroups, void | string>({
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
    setAddExpenseToGroup: builder.mutation({
      async queryFn({
        groupId,
        userExpenseAmountNumber,
        userExpenseDescription,
        userExpenseName,
        createdAt,
      }) {
     
        try {
          await addDoc(collection(db, `userGroups/${groupId}/expenses`), {
            user_expense_amount: userExpenseAmountNumber,
            user_expense_description: userExpenseDescription,
            user_expense_name: userExpenseName,
            created_at: createdAt,
          });
          return { data: null };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Score"],
    }),
    deleteExpenseGroup: builder.mutation({
      async queryFn({ groupId, expenseId }) {
        try {
          await deleteDoc(
            doc(db, `userGroups/${groupId}/expenses/${expenseId}`)
          );
          return { data: null };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Score"],
    }),
  }),
});

export const {
  useFetchUserGroupsQuery,
  useFetchUserGroupQuery,
  useSetAddExpenseToGroupMutation,
  useDeleteExpenseGroupMutation,
} = scoresApi;
