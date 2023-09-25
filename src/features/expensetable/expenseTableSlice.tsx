import { firestoreApi } from "../../firestoreApi";
import { UserGroups, UserGroup } from "../../types";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  limit,
} from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { query, where } from "firebase/firestore";

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
            collection(db, `userGroups/${urlId}/expenses`),
            where("settled_up", "==", false)
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
    fetchUserExpenses: builder.query<UserGroups, void | string>({
      async queryFn(email: string) {
        try {
          const expensesArray: UserGroups = [];

          const userGroupRef = collection(db, "userGroups");
          const queryGroupByEmail = query(
            userGroupRef,
            where("user_group_email", "array-contains", email)
          );
          const querySnapshot = await getDocs(queryGroupByEmail);

          for (const doc of querySnapshot.docs) {
            const expensesCollectionRef = query(
              collection(doc.ref, "expenses"),
              limit(3)
            );
            const expensesSnapshot = await getDocs(expensesCollectionRef);

            for (const expenseDoc of expensesSnapshot.docs) {
              expensesArray.push({
                id: expenseDoc.id,
                ...expenseDoc.data(),
              } as UserGroup);
            }
          }

          console.log(expensesArray);
          return { data: expensesArray };
        } catch (error: unknown) {
          console.error((error as Error).message);
          return { error: (error as Error).message };
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
        settledUp,
        createdAt,
      }) {
        try {
          await addDoc(collection(db, `userGroups/${groupId}/expenses`), {
            user_expense_amount: userExpenseAmountNumber,
            user_expense_description: userExpenseDescription,
            user_expense_name: userExpenseName,
            settled_up: settledUp,
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
  useFetchUserExpensesQuery,
  useSetAddExpenseToGroupMutation,
  useDeleteExpenseGroupMutation,
} = scoresApi;
