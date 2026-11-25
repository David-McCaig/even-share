const { strict: assert } = require('node:assert');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the hook's state transitions without a browser or database writes.
function createPagination() {
  const slots = [];
  let cursor = 0;
  let changed = false;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => {
        const next = typeof value === 'function' ? value(slots[index]) : value;
        if (next !== slots[index]) changed = true;
        slots[index] = next;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ??= { current: initial };
    },
  };
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(`${__dirname}/usePagination.tsx`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: () => react, Set });
  return (...args) => {
    let result;
    do {
      changed = false;
      cursor = 0;
      result = module.exports.usePagination(...args);
    } while (changed);
    return result;
  };
}
const expenses = (start, count) => Array.from({ length: count }, (_, index) => ({
  id: String(start + index), created_at: { seconds: 1000 - start - index, nanoseconds: 1 },
}));
const ids = state => Array.from(state.expenses, expense => expense.id);

test('starts with nine items and appends four at a time using the last visible cursor', async () => {
  const render = createPagination();
  const first = expenses(1, 10);
  const requests = [];
  const fetch = async request => { requests.push(request); return expenses(10, 5); };
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
  let resolve;
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
  const fetch = async request => expenses(Number(request.after.id) + 1, 5);
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
  let reject;
  const fetch = () => { calls++; return new Promise((_, fail) => { reject = fail; }); };
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
  let resolveOld;
  const old = render('A', first, () => new Promise(done => { resolveOld = done; })).showMore();
  render('B', expenses(40, 10), async () => []);
  render('A', first, async () => []);
  resolveOld(expenses(10, 5));
  await old;
  assert.deepEqual(ids(render('A', first, async () => [])), expenses(1, 9).map(x => x.id));
});
