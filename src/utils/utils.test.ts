import { strict as assert } from "node:assert";
import { test } from "node:test";
import { getPersonalBalance } from "./utils";

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
