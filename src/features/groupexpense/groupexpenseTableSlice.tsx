import { firestoreApi } from "../../firestoreApi";
import { UserGroups, UserGroup, ExpensePageRequest } from "../../types";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  limit,
  orderBy,
  startAfter,
  documentId,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { query, where, Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

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
      async queryFn(urlId) {
        try {
          const billQuery = query(
            collection(db, `userGroups/${urlId}/expenses`),
            orderBy("created_at", "desc"),
            orderBy(documentId(), "desc"),
            limit(10),
            where("settled_up", "==", false)
          );
          const querySnapshot = await getDocs(billQuery);
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            const createdTimestamp = data.created_at;
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
    fetchPaginatedExpensesForGroup: builder.query<UserGroups, ExpensePageRequest>({
      async queryFn({ id: urlId, after }) {
        try {
          const billQuery = query(
            collection(db, `userGroups/${urlId}/expenses`),
            orderBy("created_at", "desc"),
            orderBy(documentId(), "desc"),
            limit(5),
            where("settled_up", "==", false),
            startAfter(new Timestamp(after.created_at.seconds, after.created_at.nanoseconds), after.id)
          );

          const querySnapshot = await getDocs(billQuery);
          const userGroups: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            const createdTimestamp = data.created_at;
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
    setAddGroup: builder.mutation({
      async queryFn({ user_group_email, user_group_name }) {
        try {
          const loadingToast = toast.loading("Adding group...");
          await addDoc(collection(db, "userGroups"), {
            user_group_name: user_group_name,
            user_group_email: user_group_email,
          });
          toast.dismiss(loadingToast);
          toast.success("Group has been added");
          return { data: null };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["groupExpense"],
    }),
    setAddExpenseToGroup: builder.mutation({
      async queryFn({
        groupId,
        userExpenseAmountNumber,
        userExpenseDescription,
        userExpenseName,
        userExpenseEmail,
        settledUp,
        createdAt,
        expenseGroupsArray,
        recentActivityId,
      }) {
        try {
          const { seconds, nanoseconds } = createdAt;
          const createdTimestamp = new Timestamp(seconds, nanoseconds);

          const expenseData = {
            user_expense_amount: userExpenseAmountNumber,
            user_expense_description: userExpenseDescription,
            user_expense_name: userExpenseName,
            user_expense_email: userExpenseEmail,
            settled_up: settledUp,
            created_at: createdTimestamp,
            delete_expense: false,
          };

          const loadingToast = toast.loading("Adding expense...");

          const expenseRef = doc(
            collection(db, `userGroups/${groupId}/expenses`),
            recentActivityId
          );

          await setDoc(expenseRef, {
            ...expenseData,
          });

          const postRecentExpenses = async (userEmail: string) => {
            const userRef = collection(db, "recentExpenses");
            const queryUser = query(
              userRef,
              where("user_email", "==", userEmail)
            );

            const userDocs = await getDocs(queryUser);

            if (userDocs.docs[0]?.id === undefined) {
              // Document doesn't exist, create a new document with user_email
              const newUserDocRef = doc(userRef); // No custom ID for userDoc
              await setDoc(newUserDocRef, {
                user_email: userEmail,
              });

              // Now, create the "expenses" subcollection and add the expense with a custom ID
              const expensesRef = collection(newUserDocRef, "expenses");
              await setDoc(doc(expensesRef, recentActivityId), {
                ...expenseData,
              });
            } else {
              const expensesRef = collection(
                db,
                "recentExpenses",
                userDocs.docs[0].id,
                "expenses"
              );
              await setDoc(doc(expensesRef, recentActivityId), {
                ...expenseData,
              });
            }
          };
          await Promise.all(expenseGroupsArray.map((email: string) => postRecentExpenses(email)));
          toast.dismiss(loadingToast);
          toast.success("Expense added");
          return { data: null };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ["groupExpense", "recentActivity"],
    }),
    settleGroupExpenses: builder.mutation<null, { groupId: string; memberEmails: string[] }>({
      async queryFn({ groupId, memberEmails }) {
        try {
          const expenses = await getDocs(query(collection(db, `userGroups/${groupId}/expenses`), where("settled_up", "==", false)));
          const recentUsers = await Promise.all([...new Set(memberEmails)].map(email =>
            getDocs(query(collection(db, "recentExpenses"), where("user_email", "==", email)))));
          const batch = writeBatch(db);
          for (const expense of expenses.docs) {
            batch.update(expense.ref, { settled_up: true });
          }
          // These copies back Recent Activity; update them in the same atomic commit.
          for (const users of recentUsers) {
            for (const user of users.docs) {
              const copies = await Promise.all(expenses.docs.map(expense =>
                getDoc(doc(user.ref, "expenses", expense.id))));
              for (const copy of copies) {
                if (copy.exists()) batch.update(copy.ref, { settled_up: true });
              }
            }
          }
          await batch.commit();
          return { data: null };
        } catch (error) {
          return { error: (error as Error).message };
        }
      },
      invalidatesTags: (_result, error) => error ? [] : ["groupExpense", "balanceSummary", "recentActivity"],
    }),
    deleteExpenseGroup: builder.mutation<null, { groupId: string; expenseId: string; expenseGroupsArray: string[] }>({
      async queryFn({ groupId, expenseId, expenseGroupsArray }) {
        const loadingToast = toast.loading("Deleting expense...");
        try {
          if (!groupId || !expenseId || !expenseGroupsArray?.length) throw new Error("Unable to identify this expense’s group.");
          const expenseRef = doc(db, `userGroups/${groupId}/expenses/${expenseId}`);
          const expense = await getDoc(expenseRef);
          if (!expense.exists()) throw new Error("This expense no longer exists.");
          if (expense.data().settled_up !== false) throw new Error("Settled expenses cannot be deleted.");
          const recentUsers = await Promise.all([...new Set(expenseGroupsArray)].map(email =>
            getDocs(query(collection(db, "recentExpenses"), where("user_email", "==", email)))));
          const batch = writeBatch(db);
          batch.delete(expenseRef);
          for (const users of recentUsers) {
            for (const user of users.docs) batch.delete(doc(user.ref, "expenses", expenseId));
          }
          await batch.commit();
          toast.success("Expense deleted");
          return { data: null };
        } catch (error) {
          const message = (error as Error).message;
          toast.error(message);
          return { error: message };
        } finally {
          toast.dismiss(loadingToast);
        }
      },
      invalidatesTags: ["groupExpense", "recentActivity"],
    }),
  }),
});

export const {
  useFetchUserGroupsQuery,
  useFetchExpensesForGroupQuery,
  useLazyFetchPaginatedExpensesForGroupQuery,
  useFetchUserExpensesQuery,
  useSetAddExpenseToGroupMutation,
  useSetAddGroupMutation,
  useDeleteExpenseGroupMutation,
  useSettleGroupExpensesMutation,
} = scoresApi;
