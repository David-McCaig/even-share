import { strict as assert } from 'node:assert';
import { test, vi } from 'vitest';
import { useRef, useState } from 'react';
import { usePagination } from './usePagination';
import type { ExpensePageRequest, UserGroup } from '../types';

vi.mock('react', () => ({ useState: vi.fn(), useRef: vi.fn() }));

// Exercise the hook's state transitions without a browser or database writes.
function createPagination() {
  const slots: unknown[] = [];
  let cursor = 0;
  let changed = false;
  const react = {
    useState(initial: unknown) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (value: unknown) => {
        const next = typeof value === 'function' ? value(slots[index]) : value;
        if (next !== slots[index]) changed = true;
        slots[index] = next;
      }];
    },
    useRef(initial: unknown) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
  };
  return (...args: Parameters<typeof usePagination>) => {
    vi.mocked(useState).mockImplementation(react.useState as typeof useState);
    vi.mocked(useRef).mockImplementation(react.useRef as typeof useRef);
    let result: ReturnType<typeof usePagination>;
    do {
      changed = false;
      cursor = 0;
      result = usePagination(...args);
    } while (changed);
    return result;
  };
}
const expenses = (start: number, count: number): UserGroup[] => Array.from({ length: count }, (_, index) => ({
  id: String(start + index), user_expense_name: "Steve", user_expense_amount: 1, user_expense_description: "Test",
  user_group_id: "A", user_group_name: "Travel", user_group_email: [], expenseGroupsArray: [], settled_up: false, created_at: { seconds: 1000 - start - index, nanoseconds: 1 },
}));
const ids = (state: ReturnType<typeof usePagination>) => Array.from(state.expenses, expense => expense.id);

test('starts with nine items and appends four at a time using the last visible cursor', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  const requests: ExpensePageRequest[] = [];
  const fetch = async (request: ExpensePageRequest) => { requests.push(request); return expenses(10, 5); };
  let state = render('A', first, fetch);
  assert.equal(state.expenses.length, 9);
  assert.equal(state.hasMore, true);
  await state.showMore();
  state = render('A', first, fetch);
  assert.deepEqual(ids(state), expenses(1, 13).map(x => x.id));
  assert.equal(requests[0].id, 'A');
  assert.equal(requests[0].after.id, '9');
  assert.equal(requests[0].after.created_at.nanoseconds, 1);
});

test('empty, short and exactly nine-item lists have no more button', () => {
  for (const count of [0, 3, 9]) {
    const state = createPagination()('A', expenses(1, count), async () => []);
    assert.equal(state.hasMore, false);
  }
});

test('a final full four-item page hides the button without an extra click', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  const fetch = async () => expenses(10, 4);
  await render('A', first, fetch).showMore();
  assert.equal(render('A', first, fetch).hasMore, false);
  assert.equal(render('A', first, fetch).expenses.length, 13);
});

test('overlapping and repeated IDs are not appended twice', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  const fetch = async () => [first[8], first[9], first[9], ...expenses(11, 2)];
  await render('A', first, fetch).showMore();
  assert.deepEqual(ids(render('A', first, fetch)), expenses(1, 11).map(x => x.id));
});

test('navigation resets the list and ignores an old group response', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  let resolve!: (expenses: UserGroup[]) => void;
  const pending = render('A', first, () => new Promise(done => { resolve = done; })).showMore();
  const other = expenses(40, 10);
  render('B', other, async () => []);
  resolve(expenses(10, 5));
  await pending;
  assert.deepEqual(ids(render('B', other, async () => [])), expenses(40, 9).map(x => x.id));
  const returned = render('A', first, async () => []);
  assert.deepEqual(ids(returned), expenses(1, 9).map(x => x.id));
  assert.equal(returned.hasMore, true);
});

test('returning to a cached list starts a continuous sequence again', async () => {
  const first = expenses(1, 10);
  const fetch = async (request: ExpensePageRequest) => expenses(Number(request.after.id) + 1, 5);
  const render = createPagination();
  await render('A', first, fetch).showMore();
  await render('A', first, fetch).showMore();
  assert.equal(render('A', first, fetch).expenses.length, 17);
  const reopened = createPagination();
  await reopened('A', first, fetch).showMore();
  assert.deepEqual(ids(reopened('A', first, fetch)), expenses(1, 13).map(x => x.id));
});

test('duplicate clicks make one request; errors preserve rows and allow retry', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  let calls = 0;
  let reject!: (error: Error) => void;
  const fetch = () => { calls++; return new Promise<UserGroup[]>((_, fail) => { reject = fail; }); };
  const state = render('A', first, fetch);
  const request = state.showMore();
  await state.showMore();
  assert.equal(calls, 1);
  reject(new Error('Offline'));
  await request;
  const failed = render('A', first, fetch);
  assert.equal(failed.error, true);
  assert.equal(failed.isFetching, false);
  assert.equal(failed.expenses.length, 9);
  await render('A', first, async () => expenses(10, 2)).showMore();
  const retried = render('A', first, fetch);
  assert.equal(retried.error, false);
  assert.equal(retried.expenses.length, 11);
  assert.equal(retried.hasMore, false);
});

test('a stale response is ignored even after navigating away and back to the same group', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  let resolveOld!: (expenses: UserGroup[]) => void;
  const old = render('A', first, () => new Promise(done => { resolveOld = done; })).showMore();
  render('B', expenses(40, 10), async () => []);
  render('A', first, async () => []);
  resolveOld(expenses(10, 5));
  await old;
  assert.deepEqual(ids(render('A', first, async () => [])), expenses(1, 9).map(x => x.id));
});

test('deleting a later-page expense resets the list even when the first page is unchanged', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  let remaining = expenses(10, 5);
  const fetch = async () => remaining;
  await render('A', first, fetch, 1).showMore();
  assert.ok(ids(render('A', first, fetch, 1)).includes('12'));

  remaining = remaining.filter(expense => expense.id !== '12');
  // RTK Query preserves the first-page array reference when its data is unchanged.
  const refreshed = render('A', first, fetch, 2);
  assert.deepEqual(ids(refreshed), expenses(1, 9).map(x => x.id));
  assert.equal(refreshed.hasMore, true);
  await refreshed.showMore();
  assert.deepEqual(ids(render('A', first, fetch, 2)), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '13', '14']);
});

test('a refresh ignores an in-flight response from before the expense change', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  let resolveOld!: (expenses: UserGroup[]) => void;
  const fetch = () => new Promise<UserGroup[]>(resolve => { resolveOld = resolve; });
  const pending = render('A', first, fetch, 1).showMore();
  render('A', first, fetch, 2);
  resolveOld(expenses(10, 5));
  await pending;
  const refreshed = render('A', first, fetch, 2);
  assert.deepEqual(ids(refreshed), expenses(1, 9).map(x => x.id));
  assert.equal(refreshed.isFetching, false);
});
