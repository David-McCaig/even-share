import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

//API slice for interacting with Firestore.
export const firestoreApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['groupExpense','recentActivity','balanceSummary'],
  endpoints: () => ({}),
});