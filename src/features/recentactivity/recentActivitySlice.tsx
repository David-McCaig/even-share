import { firestoreApi } from "../../firestoreApi";
import {
  query,
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import { UserGroups, UserGroup } from "../../types";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

let indexUserGroupId = 0;
let pagination: DocumentSnapshot<DocumentData> | null = null;

export const recentActivityApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRecentActivity: builder.query<UserGroups, UserGroups | void>({
      async queryFn(groupId) {
        indexUserGroupId = 0;
        pagination = null;
        try {
          const first = query(
            collection(
              db,
              `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
            ),
            orderBy("settled_up", "asc"),
            limit(10)
          );
          const querySnapshot = await getDocs(first);
          pagination = querySnapshot.docs[querySnapshot.docs.length - 1];
          const expenseArray: UserGroups = [];
          querySnapshot?.forEach((doc) => {
            expenseArray.push({ id: doc.id, ...doc.data() } as UserGroup);
          });

          return { data: expenseArray };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["Score"],
    }),

    fetchRecentActivityPagination: builder.query<UserGroups, UserGroups | void>(
      {
        async queryFn(groupId) {
          console.log(indexUserGroupId)
          try {
            if (!pagination) return { data: [] };
            const next = query(
              collection(
                db,
                `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
              ),
              orderBy("settled_up", "asc"),
              startAfter(pagination),
              limit(3)
            );
            const querySnapshot = await getDocs(next);
            if (
              querySnapshot.docs.length === 0 &&
              indexUserGroupId < (groupId?.length || 0) - 1
            ) {
              // No more expenses in the current user group. Move to the next group.
              indexUserGroupId = indexUserGroupId + 1;

              pagination = null; // Reset pagination for the new group.

              // Fetch the expenses for the next user group immediately.
              const nextGroup = query(
                collection(
                  db,
                  `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
                ),
                orderBy("settled_up", "asc"),
                limit(5)
              );
              const nextGroupSnapshot = await getDocs(nextGroup);
              pagination =
                nextGroupSnapshot.docs[nextGroupSnapshot.docs.length - 1] ||
                null;
              const nextExpenseArray: UserGroups = [];
              nextGroupSnapshot.forEach((doc) => {
                nextExpenseArray.push({
                  id: doc.id,
                  ...doc.data(),
                } as UserGroup);
              });

              // expensesArray = [...expensesArray, ...nextExpenseArray];
              return { data: nextExpenseArray };
            } else {
              pagination = querySnapshot.docs[querySnapshot.docs.length - 1];
              const expenseArray: UserGroups = [];
              querySnapshot.forEach((doc) => {
                expenseArray.push({ id: doc.id, ...doc.data() } as UserGroup);
              });
              // expensesArray = [...expensesArray, ...expenseArray];
              return { data: expenseArray };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            console.error(error.message);
            return { error: error.message };
          }
        },
        providesTags: ["Score"],
      }
    ),
  }),
});

export const {
  useFetchRecentActivityQuery,
  useFetchRecentActivityPaginationQuery,
} = recentActivityApi;
