import { firestoreApi } from "../../firestoreApi";
import {
  query,
  collection,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
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
            orderBy("created_at", "asc"),
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

          return { data: expenseArray };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ["recentActivity"],
    }),

    fetchRecentActivityPagination: builder.query<UserGroups, UserGroups | void>(
      {
        async queryFn(groupId) {
          try {
            if (!pagination) return { data: [] };
            const next = query(
              collection(
                db,
                `userGroups/${groupId?.[indexUserGroupId]?.id}/expenses`
              ),
              orderBy("created_at", "asc"),
              startAfter(pagination),
              limit(4)
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
                orderBy("created_at", "asc"),
                limit(4)
              );
              const nextGroupSnapshot = await getDocs(nextGroup);
              pagination =
                nextGroupSnapshot.docs[nextGroupSnapshot.docs.length - 1] ||
                null;
              const nextExpenseArray: UserGroups = [];
              nextGroupSnapshot?.forEach((doc) => {
                const data = doc.data();
                const createdTimestamp = data.created_at;
                nextExpenseArray.push({
                  id: doc.id,
                  ...data,
                  created_at: {
                    seconds: createdTimestamp.seconds,
                    nanoseconds: createdTimestamp.nanoseconds,
                  },
                } as UserGroup);
              });

              // expensesArray = [...expensesArray, ...nextExpenseArray];
              return { data: nextExpenseArray };
            } else {
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
              // expensesArray = [...expensesArray, ...expenseArray];
              return { data: expenseArray };
            }
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
