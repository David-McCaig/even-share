import { firestoreApi } from "../../firestoreApi";
import {
  query,
  collection,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { UserGroups, UserGroup } from "../../types";

export const recentActivityApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchExpensesForBalanceSummaryGroup: builder.query<UserGroups, void | string>({
        async queryFn( urlId ) {
          try {
            const billQuery = query(
              collection(db, `userGroups/${urlId}/expenses`),
              orderBy("settled_up", "asc"),
              where("settled_up", "==", false)
            );
            const querySnapshot = await getDocs(billQuery);
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
        providesTags: ["balanceSummary"],
      }),
  }),
});

export const {
  useFetchExpensesForBalanceSummaryGroupQuery,
} = recentActivityApi;