import { firestoreApi } from "../../firestoreApi";
import {
  query,
  documentId,
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { UserGroups, UserGroup } from "../../types";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

let pagination: DocumentSnapshot<DocumentData> | null = null;

// Recent activity stores the same expense ID as its source group, but no group metadata.
async function attachExpenseGroups(expenses: UserGroups, email: string): Promise<UserGroups> {
  if (!expenses.length) return expenses;
  try {
    const groups = await getDocs(query(collection(db, "userGroups"), where("user_group_email", "array-contains", email)));
    const matches = await Promise.all(groups.docs.map(async group => {
      const groupExpenses = await getDocs(query(collection(db, `userGroups/${group.id}/expenses`), where(documentId(), "in", expenses.map(expense => expense.id))));
      return groupExpenses.docs.map(expense => [expense.id, { user_group_id: group.id, user_group_name: group.data().user_group_name }] as const);
    }));
    const groupByExpense = new Map(matches.flat());
    return expenses.map(expense => ({ ...expense, ...groupByExpense.get(expense.id) }));
  } catch (error) {
    console.error("Unable to load activity group names:", error);
    return expenses;
  }
}


export const recentActivityApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRecentActivity: builder.query<UserGroups, string>({
      async queryFn(email) {
        pagination = null;

        const q = query(
          collection(db, "recentExpenses"),
          where("user_email", "==", email)
        );
        
        try {
          const querySnap = await getDocs(q);
          const first = query(
            collection(db, `recentExpenses/${querySnap.docs[0].id}/expenses`),
            orderBy("created_at", "desc"),
            limit(9)
          );
          const querySnapshot = await getDocs(first);
         
          pagination = querySnapshot.docs[querySnapshot.docs.length - 1];
          const expenseArray: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            const data = doc.data();
            const createdTimestamp = data.created_at;
            expenseArray.push({
              id: doc.id,
              ...data,
              created_at: {
                seconds: createdTimestamp.seconds,
                nanoseconds: createdTimestamp.nanoseconds,
              },
            } as UserGroup);
          });

          return { data: await attachExpenseGroups(expenseArray, email) };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["recentActivity"],
    }),

    fetchRecentActivityPagination: builder.query<UserGroups, string>(
      {
        async queryFn(email) {
          const q = query(
            collection(db, "recentExpenses"),
            where("user_email", "==", email)
          );
          try {
            if (!pagination) return { data: [] };
            const querySnap = await getDocs(q);
            
            const next = query(
              collection(
                db,
                `recentExpenses/${querySnap.docs[0].id}/expenses`
              ),
              orderBy("created_at", "desc"),
              startAfter(pagination),
              limit(4)
            );
            const querySnapshot = await getDocs(next);
      
            pagination = querySnapshot.docs[querySnapshot.docs.length - 1];
            const expenseArray: UserGroups = [];
            querySnapshot?.forEach((doc) => {
              const data = doc.data();
              const createdTimestamp = data.created_at;
              expenseArray.push({
                id: doc.id,
                ...data,
                created_at: {
                  seconds: createdTimestamp.seconds,
                  nanoseconds: createdTimestamp.nanoseconds,
                },
              } as UserGroup);
            });
            return { data: await attachExpenseGroups(expenseArray, email) };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error(error.message);
            return { error: error.message };
          }
        },
        providesTags: ["recentActivity"],
      }
    ),
  }),
});

export const {
  useFetchRecentActivityQuery,
  useFetchRecentActivityPaginationQuery,
} = recentActivityApi;
