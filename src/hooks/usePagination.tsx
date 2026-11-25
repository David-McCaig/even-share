import { useRef, useState } from "react";
import { ExpensePageRequest, UserGroup } from "../types";

export const usePagination = (
  scope: string,
  firstPage: UserGroup[] | undefined,
  fetchPage: (request: ExpensePageRequest) => Promise<UserGroup[]>
) => {
  const initialState = () => ({
    scope,
    firstPage,
    revision: 0,
    expenses: firstPage?.slice(0, 9) ?? [],
    hasMore: (firstPage?.length ?? 0) > 9,
    isFetching: false,
    error: false,
  });
  const [state, setState] = useState(initialState);
  const pending = useRef<number | null>(null);

  // Reset before rendering another group or a refreshed first page.
  if (state.scope !== scope || state.firstPage !== firstPage) {
    setState({ ...initialState(), revision: state.revision + 1 });
  }

  const showMore = async () => {
    if (pending.current === state.revision || state.isFetching || !state.hasMore) return;
    pending.current = state.revision;
    setState(previous => ({ ...previous, isFetching: true, error: false }));
    try {
      const last = state.expenses[state.expenses.length - 1];
      const page = await fetchPage({ id: scope, after: { id: last.id, created_at: last.created_at } });
      setState(previous => {
        if (previous.revision !== state.revision) return previous;
        const seen = new Set(previous.expenses.map(expense => expense.id));
        return {
          ...previous,
          expenses: [...previous.expenses, ...page.slice(0, 4).filter(expense => {
            if (seen.has(expense.id)) return false;
            seen.add(expense.id);
            return true;
          })],
          hasMore: page.length > 4,
          isFetching: false,
        };
      });
    } catch {
      setState(previous => previous.revision === state.revision
        ? { ...previous, isFetching: false, error: true }
        : previous);
    } finally {
      if (pending.current === state.revision) pending.current = null;
    }
  };

  return { ...state, showMore };
};
