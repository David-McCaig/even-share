import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';

const database = vi.hoisted(() => ({
  docs: new Map<string, Record<string, unknown>>(),
  commitGate: undefined as Promise<void> | undefined,
  commitStarted: false,
}));
vi.mock('../../firebase/firebaseconfig', () => ({ db: {} }));
vi.mock('react-hot-toast', () => ({ toast: { loading: vi.fn(), dismiss: vi.fn(), success: vi.fn(), error: vi.fn() } }));
vi.mock('firebase/firestore', () => {
  const ref = (...args: Array<string | { path?: string }>) => ({
    path: args.map(arg => typeof arg === 'string' ? arg : arg.path).filter(Boolean).join('/'),
  });
  const snapshot = (path: string, data: Record<string, unknown>) => ({
    id: path.split('/').at(-1), ref: { path }, data: () => ({ ...data }), exists: () => true,
  });
  return {
    collection: ref, doc: ref,
    where: (field: string, op: string, value: unknown) => ({ field, op, value }),
    query: (reference: { path: string }, ...conditions: unknown[]) => ({ ...reference, conditions }),
    orderBy: vi.fn(), limit: vi.fn(), startAfter: vi.fn(), documentId: () => '__id__',
    Timestamp: class { constructor(public seconds: number, public nanoseconds: number) {} },
    getDoc: vi.fn(async ({ path }: { path: string }) => database.docs.has(path)
      ? snapshot(path, database.docs.get(path)!) : { exists: () => false }),
    getDocs: vi.fn(async ({ path, conditions = [] }: { path: string; conditions?: Array<{ field: string; op: string; value: unknown } | undefined> }) => {
      const docs = [...database.docs].filter(([key, data]) => key.slice(0, key.lastIndexOf('/')) === path && conditions.every(condition => {
        if (!condition) return true;
        const value = condition.field === '__id__' ? key.split('/').at(-1) : data[condition.field];
        if (condition.op === 'array-contains') return (value as unknown[])?.includes(condition.value);
        if (condition.op === 'in') return (condition.value as unknown[]).includes(value);
        return value === condition.value;
      })).map(([key, data]) => snapshot(key, data));
      return { docs, forEach: (fn: (doc: unknown) => void) => docs.forEach(fn) };
    }),
    setDoc: vi.fn(async ({ path }: { path: string }, data: Record<string, unknown>) => { database.docs.set(path, data); }),
    addDoc: vi.fn(), deleteDoc: vi.fn(async ({ path }: { path: string }) => { database.docs.delete(path); }),
    writeBatch: () => {
      const updates: Array<{ path: string; data: Record<string, unknown> }> = [];
      return {
        update: ({ path }: { path: string }, data: Record<string, unknown>) => updates.push({ path, data }),
        commit: async () => {
          database.commitStarted = true;
          await database.commitGate;
          updates.forEach(({ path, data }) => database.docs.set(path, { ...database.docs.get(path), ...data }));
        },
      };
    },
  };
});

import { setupStore } from '../../store';
import { login } from '../authentication/userSlice';
import { firestoreApi } from '../../firestoreApi';
import { scoresApi } from './groupexpenseTableSlice';
import { recentActivityApi as balanceApi } from '../balancesummary/balanceSummarySlice';
import { recentActivityApi as activityApi } from '../recentactivity/recentActivitySlice';
import BalanceSummaryAllGroups from '../balancesummary/Component/BalanceSummaryAllGroups';

const email = 'steve@gmail.com';
const members = ['lisa@gmail.com', email, 'owen@gmail.com'];
let store: ReturnType<typeof setupStore>;
const expense = (name: string, amount: number) => ({
  user_expense_name: name, user_expense_email: `${name.toLowerCase()}@gmail.com`,
  user_expense_description: 'Hotel', user_expense_amount: amount,
  settled_up: false, created_at: { seconds: 1, nanoseconds: 0 },
});
const balance = () => balanceApi.endpoints.fetchExpensesForBalanceSummaryGroup.select('travel')(store.getState()).data;
const activity = () => activityApi.endpoints.fetchRecentActivity.select(email)(store.getState()).data;
const renderBalances = () => renderToStaticMarkup(createElement(Provider, { store, children: createElement(BalanceSummaryAllGroups) }));

beforeEach(() => {
  database.docs.clear();
  database.commitGate = undefined;
  database.commitStarted = false;
  database.docs.set('userGroups/travel', { user_group_name: 'Travel', user_group_email: members });
  database.docs.set('userGroups/living', { user_group_name: 'Living', user_group_email: members });
  database.docs.set('userGroups/travel/expenses/hotel', expense('Lisa', 480));
  database.docs.set('userGroups/living/expenses/rent', expense('Steve', 30));
  members.forEach((member, index) => {
    database.docs.set(`recentExpenses/user${index}`, { user_email: member });
    database.docs.set(`recentExpenses/user${index}/expenses/hotel`, expense('Lisa', 480));
  });
  store = setupStore();
  store.dispatch(login({ email, displayName: 'Steve' }));
});
afterEach(() => { store.dispatch(firestoreApi.util.resetApiState()); });

async function subscribe() {
  await Promise.all([
    store.dispatch(scoresApi.endpoints.fetchUserGroups.initiate(email as never)),
    store.dispatch(balanceApi.endpoints.fetchExpensesForBalanceSummaryGroup.initiate('travel')),
    store.dispatch(balanceApi.endpoints.fetchExpensesForBalanceSummaryGroup.initiate('living')),
    store.dispatch(activityApi.endpoints.fetchRecentActivity.initiate(email)),
  ]);
}

test('adding to an earlier group refreshes its balance and recent activity with both groups subscribed', async () => {
  await subscribe();
  expect(renderBalances()).toContain('160.00');
  await store.dispatch(scoresApi.endpoints.setAddExpenseToGroup.initiate({
    groupId: 'travel', userExpenseAmountNumber: 60, userExpenseDescription: 'Fuel',
    userExpenseName: 'Steve', userExpenseEmail: email, settledUp: false,
    createdAt: { seconds: 2, nanoseconds: 0 }, expenseGroupsArray: members, recentActivityId: 'fuel',
  })).unwrap();
  await vi.waitFor(() => {
    expect(balance()).toHaveLength(2);
    expect(activity()?.some(item => item.user_expense_description === 'Fuel')).toBe(true);
    expect(renderBalances()).toContain('120.00');
  });
});

test('settlement waits for the commit then refreshes balances and all activity copies', async () => {
  await subscribe();
  let release!: () => void;
  database.commitGate = new Promise<void>(resolve => { release = resolve; });
  let finished = false;
  const request = store.dispatch(scoresApi.endpoints.settleGroupExpenses.initiate({ groupId: 'travel', memberEmails: members }));
  request.then(() => { finished = true; });
  await vi.waitFor(() => expect(database.commitStarted).toBe(true));
  expect(finished).toBe(false);
  expect(balance()).toHaveLength(1);
  release();
  await request.unwrap();
  await vi.waitFor(() => {
    expect(balance()).toEqual([]);
    expect(activity()?.find(item => item.id === 'hotel')?.settled_up).toBe(true);
    expect(renderBalances()).toContain('Settled up');
  });
  members.forEach((_, index) => expect(database.docs.get(`recentExpenses/user${index}/expenses/hotel`)?.settled_up).toBe(true));
  expect(database.docs.get('userGroups/living/expenses/rent')?.settled_up).toBe(false);
});

test('failed settlement writes preserve balances and return an error', async () => {
  await subscribe();
  database.commitGate = Promise.reject(new Error('Write denied'));
  const request = store.dispatch(scoresApi.endpoints.settleGroupExpenses.initiate({ groupId: 'travel', memberEmails: members }));
  await expect(request.unwrap()).rejects.toBe('Write denied');
  expect(balance()).toHaveLength(1);
  expect(activity()?.[0].settled_up).toBe(false);
});
