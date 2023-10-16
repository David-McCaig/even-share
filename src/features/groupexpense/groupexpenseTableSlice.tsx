import { firestoreApi } from "../../firestoreApi";
import { UserGroups, UserGroup } from "../../types";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { query, where, Timestamp } from "firebase/firestore";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

let groupSnapshotArray: DocumentSnapshot<DocumentData> | null = null;

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
      providesTags: ["groupExpense"],
    }),
    
    fetchExpensesForGroup: builder.query<UserGroups, void | string>({
      async queryFn( urlId ) {
        groupSnapshotArray = null;
        try {
          const billQuery = query(
            collection(db, `userGroups/${urlId}/expenses`),
            orderBy("created_at", "asc"),
            limit(9),
            where("settled_up", "==", false),
          );
          const querySnapshot = await getDocs(billQuery);
          groupSnapshotArray = querySnapshot.docs[querySnapshot.docs.length - 1];
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            const createdTimestamp = data.created_at 
            userGroups.push({
              id: doc.id,
              ...data,
              created_at: {
                seconds: createdTimestamp.seconds,
                nanoseconds: createdTimestamp.nanoseconds,
              },
            } as UserGroup);
          });
          
          return { data: userGroups };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["groupExpense"],
    }),
    fetchPaginatedExpensesForGroup: builder.query<UserGroups, void | string>({
      async queryFn( urlId ) {
        
        try {
          if (!groupSnapshotArray) return { data: [] };
          
          const billQuery = query(
            collection(db, `userGroups/${urlId}/expenses`),
            orderBy("created_at", "asc"),
            limit(4),
            where("settled_up", "==", false),
            startAfter(groupSnapshotArray)
          );
          
          const querySnapshot = await getDocs(billQuery);
          groupSnapshotArray = querySnapshot.docs[querySnapshot.docs.length - 1];
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            const createdTimestamp = data.created_at 
            userGroups.push({
              id: doc.id,
              ...data,
              created_at: {
                seconds: createdTimestamp.seconds,
                nanoseconds: createdTimestamp.nanoseconds,
              },
            } as UserGroup);
          });
          return { data: userGroups };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["groupExpense"],
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
          return { data: expensesArray };
        } catch (error: unknown) {
          console.error((error as Error).message);
          return { error: (error as Error).message };
        }
      },
      providesTags: ["groupExpense"],
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
          const { seconds, nanoseconds } = createdAt;
          const createdTimestamp = new Timestamp(seconds, nanoseconds);
          await addDoc(collection(db, `userGroups/${groupId}/expenses`), {
            user_expense_amount: userExpenseAmountNumber,
            user_expense_description: userExpenseDescription,
            user_expense_name: userExpenseName,
            settled_up: settledUp,
            created_at: createdTimestamp,
          });
          return { data: null };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["groupExpense"],
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
      invalidatesTags: ["groupExpense"],
    }),
  }),
});

export const {
  useFetchUserGroupsQuery,
  useFetchExpensesForGroupQuery,
  useFetchPaginatedExpensesForGroupQuery,
  useFetchUserExpensesQuery,
  useSetAddExpenseToGroupMutation,
  useDeleteExpenseGroupMutation,
} = scoresApi;
