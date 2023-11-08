import { firestoreApi } from "../../firestoreApi";
import {
  query,
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

export const recentActivityApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRecentActivity: builder.query<UserGroups, UserGroups | void>({
      async queryFn(email) {
        pagination = null;

        const q = query(
          collection(db, "recentExpenses"),
          where("user_email", "==", email)
        );

        try {
          const querySnap = await getDocs(q);
          console.log(querySnap.docs[0].id);
          const first = query(
            collection(db, `recentExpenses/${querySnap.docs[0].id}/expenses`),
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
          console.log(expenseArray);

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
        async queryFn(email) {
          const q = query(
            collection(db, "recentExpenses"),
            where("user_email", "==", email)
          );
          try {
            if (!pagination) return { data: [] };
            const querySnap = await getDocs(q);
            console.log(querySnap.docs[0].id);
            const next = query(
              collection(
                db,
                `recentExpenses/${querySnap.docs[0].id}/expenses`
              ),
              orderBy("created_at", "asc"),
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
            return { data: expenseArray };

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
