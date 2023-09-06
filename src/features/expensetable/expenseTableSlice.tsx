// src/features/scores/scoresSlice.ts
import { firestoreApi } from "../../firestoreApi";
import {
  arrayUnion,
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";

interface ScoresTable {
  id: string;
  levelId: string;
}

type ScoresTables = ScoresTable[];

export const scoresApi = firestoreApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchHighScoresTables: builder.query<ScoresTables, void>({
      async queryFn() {
        try {
          const ref = collection(db, 'UserGroup');
          const querySnapshot = await getDocs(ref);
          const scoresTables: ScoresTables = [];
          querySnapshot?.forEach((doc) => {
            scoresTables.push({ id: doc.id, ...doc.data() } as ScoresTable);
          });
          return { data: scoresTables };
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ['Score'],
    }),
    fetchHighScoresTableByLevelId: builder.query<ScoresTable, string>({
      async queryFn(levelId) {
        try {
          const querySnapshot = await getDocs(
            collection(db, 'scoresTables')
          );
          const scoresTables: ScoresTables = [];
          querySnapshot?.forEach((doc) => {
            scoresTables.push({ id: doc.id, ...doc.data() } as ScoresTable);
          });
          const scoreTable = scoresTables.find(
            (table) => table.levelId === levelId
          );
          return { data: scoreTable };
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      providesTags: ['Score'],
    }),
    setNewHighScore: builder.mutation({
      async queryFn({ scoresTableId, newHighScore }) {
        try {
          await updateDoc(doc(db, 'scoresTables', scoresTableId), {
            scores: arrayUnion(newHighScore),
          });
          return { data: null };
        } catch (error: any) {
          console.error(error.message);
          return { error: error.message };
        }
      },
      invalidatesTags: ['Score'],
    }),
  }),
});

export const {
  useFetchHighScoresTablesQuery,
  useFetchHighScoresTableByLevelIdQuery,
  useSetNewHighScoreMutation,
} = scoresApi;
