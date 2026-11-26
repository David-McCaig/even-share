import { strict as assert } from "node:assert";
import { test } from "vitest";
import { getPersonalBalance, createUserObject, calculateOwes, generateBalanceSummaryStatement, formatSettlementStatement } from "./utils";
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BalanceGroup from '../features/balancesummary/Component/BalanceGroup';
import type { UserGroup } from '../types';

test('settlement labels preserve full payer and recipient names', () => {
  for (const [from, to] of [['Mary Jane', 'You'], ['You', 'Mary Jane'], ['Mary Jane', 'John Smith'], ['Lisa', 'You']]) {
    const [statement] = generateBalanceSummaryStatement([{ from, to, amount: 12.75 }]);
    assert.equal(formatSettlementStatement(statement.userString), `${from} paid ${to}`);
  }
  assert.equal(formatSettlementStatement('All people are settled up'), 'All people are settled up');
});

test("personal balance combines money owed to you and money you owe", () => {
  assert.deepEqual(getPersonalBalance([
    { userString: "Lisa owes You", userNumber: 33 },
    { userString: "Owen owes You", userNumber: 133 },
    { userString: "You owe Lisa", userNumber: 22 },
  ]), { owed: 166, owing: 22, net: 144 });
});

test("personal balance ignores transfers between other members", () => {
  assert.deepEqual(getPersonalBalance([
    { userString: "Lisa owes Owen", userNumber: 100 },
    { userString: "You owe Lisa", userNumber: 22.5 },
  ]), { owed: 0, owing: 22.5, net: -22.5 });
});

test("personal balance handles empty, settled and offsetting balances", () => {
  for (const statements of [[], [{ userString: "All people are settled up", userNumber: 0 }], [{ userString: "Lisa owes You", userNumber: 15.5 }, { userString: "You owe Owen", userNumber: 15.5 }]]) {
    assert.equal(getPersonalBalance(statements).net, 0);
  }
});


const members = ['steve@gmail.com', 'lisa@gmail.com', 'owen@gmail.com'];
const expense = (name: string, amount: number, email?: string): UserGroup => ({
  user_expense_name: name, user_expense_amount: amount, user_expense_email: email,
} as UserGroup);
const travel = [expense('Steve', 620), expense('Lisa', 400)];
const transactions = (expenses = travel, emails = members, name = 'Steve', email = members[0]) =>
  calculateOwes(createUserObject(expenses, name, emails, email));

test('Travel includes Owen despite no payments and splits $1020 three ways', () => {
  const result = transactions();
  assert.deepEqual(result, [
    { from: 'Owen', to: 'You', amount: 280 },
    { from: 'Owen', to: 'Lisa', amount: 60 },
  ]);
  assert.deepEqual(getPersonalBalance(generateBalanceSummaryStatement(result)), { owed: 280, owing: 0, net: 280 });
});

test('a signed-in member who paid nothing owes their share', () => {
  const result = transactions(travel, members, 'Owen', members[2]);
  assert.equal(result.reduce((sum, transfer) => sum + transfer.amount, 0), 340);
  assert.ok(result.every(transfer => transfer.from === 'You'));
});

test('includes every zero-spend member and deduplicates email identities', () => {
  const people = createUserObject([expense('Steve', 90)], 'Steve', [...members, ' STEVE@gmail.com '], members[0]);
  assert.equal(people.length, 3);
  assert.deepEqual(calculateOwes(people), [
    { from: 'Lisa', to: 'You', amount: 30 },
    { from: 'Owen', to: 'You', amount: 30 },
  ]);
});

test('empty expenses, an empty group, a single member, and equal contributions are settled', () => {
  assert.deepEqual(transactions([]), []);
  assert.deepEqual(transactions([], []), []);
  assert.deepEqual(transactions([expense('Steve', 10)], [members[0]]), []);
  assert.deepEqual(transactions([expense('Steve', 10), expense('Lisa', 10), expense('Owen', 10)]), []);
});

test('preserves cents and allocates an indivisible share without losing money', () => {
  const result = transactions([expense('Steve', 10)]);
  assert.deepEqual(result.map(transfer => transfer.amount), [3.33, 3.33]);
  const summaries = generateBalanceSummaryStatement(result);
  assert.equal(getPersonalBalance(summaries).owed, 6.66);
  assert.deepEqual(transactions([expense('Steve', 0.01)]), []);
});

test('payer email keeps renamed users and identical display names separate', () => {
  const expenses = [expense('Same Name', 30, members[0]), expense('Same Name', 15, members[1])];
  const people = createUserObject(expenses, 'New Name', members, members[0]);
  assert.equal(people.length, 3);
  const result = calculateOwes(people);
  assert.deepEqual(result, [{ from: 'Owen', to: 'You', amount: 15 }]);
});

test('legacy expenses match unique email names but never guess an ambiguous payer', () => {
  assert.throws(() => transactions([expense('Unknown Person', 20)]), /identify/i);
  assert.throws(() => transactions([expense('Lisa', 20)], [...members, 'lisa@example.com']), /identify/i);
});

test('balance statements retain full names and cents', () => {
  const result = generateBalanceSummaryStatement([{ from: 'Mary Jane', to: 'You', amount: 12.75 }]);
  assert.equal(result[0].userString, 'Mary Jane owes You');
  assert.equal(result[0].userNumber, 12.75);
});

test('settlement transfers conserve each member’s net balance for different amounts', () => {
  for (const amounts of [[0.1, 0.2, 0], [123.45, 6.78, 0], [0, 0, 99.99], [1, 2, 3]]) {
    const people = amounts.map((amount, i) => ({ name: members[i], expenses: [amount] }));
    const paid = amounts.map(amount => Math.round(amount * 100));
    const total = paid.reduce((sum, amount) => sum + amount, 0);
    const net = paid.map((amount, i) => amount - Math.floor(total / 3) - (i < total % 3 ? 1 : 0));
    for (const transfer of calculateOwes(people)) {
      assert.ok(transfer.amount > 0);
      const cents = Math.round(transfer.amount * 100);
      assert.ok(Math.abs(transfer.amount * 100 - cents) < 1e-8);
      net[members.indexOf(transfer.from)] += cents;
      net[members.indexOf(transfer.to)] -= cents;
    }
    assert.deepEqual(net, [0, 0, 0]);
  }
});

test('Your Balance shows only your transfers, while settlement keeps all transfers', () => {
  const summaries = generateBalanceSummaryStatement(transactions());
  assert.equal(summaries.length, 2);
  const html = renderToStaticMarkup(createElement(BalanceGroup, { name: 'Travel', balances: summaries }));
  assert.ok(html.includes('Owen'));
  assert.ok(html.includes('280.00'));
  assert.ok(!html.includes('Lisa'));
  assert.ok(!html.includes('60.00'));
});

test('an unknown explicit payer email cannot fall back to a matching display name', () => {
  assert.throws(() => transactions([expense('Steve', 10, 'other@example.com')]), /identify/i);
});

test('replacement Travel examples leave Lisa owing $40 and Owen owing $100', () => {
  const examples = [expense('Steve', 300, members[0]), expense('Lisa', 120, members[1]), expense('Owen', 60, members[2])];
  assert.deepEqual(transactions(examples), [
    { from: 'Lisa', to: 'You', amount: 40 },
    { from: 'Owen', to: 'You', amount: 100 },
  ]);
  assert.equal(getPersonalBalance(generateBalanceSummaryStatement(transactions(examples))).owed, 140);
});

test('Steve and Owen each owe Lisa $140 when Lisa pays $480 of a $600 trip', () => {
  const examples = [expense('Steve', 60, members[0]), expense('Lisa', 480, members[1]), expense('Owen', 60, members[2])];
  const summaries = generateBalanceSummaryStatement(transactions(examples));
  assert.deepEqual(transactions(examples), [
    { from: 'You', to: 'Lisa', amount: 140 },
    { from: 'Owen', to: 'Lisa', amount: 140 },
  ]);
  assert.deepEqual(getPersonalBalance(summaries), { owed: 0, owing: 140, net: -140 });
  const html = renderToStaticMarkup(createElement(BalanceGroup, { name: 'Travel', balances: summaries }));
  assert.ok(html.includes('you owe'));
  assert.ok(!html.includes('Owen'));
});
