import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserGroups } from "../types";
import { People, BalanceSummary } from "../types.tsx"

interface Transaction {
  from: string;
  to: string;
  amount: number;
}
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Membership, rather than payment history, determines who shares group expenses.
export const createUserObject = (
  groupData: UserGroups,
  displayName: string,
  memberEmails: string[],
  currentUserEmail: string,
): People[] => {
  const normalize = (value: string) => value.trim().toLowerCase();
  const currentEmail = normalize(currentUserEmail);
  const emails = [...new Set(memberEmails.map(normalize).filter(Boolean))];
  const members = emails.map(email => {
    const localName = email.split("@")[0];
    return { email, name: localName.charAt(0).toUpperCase() + localName.slice(1), expenses: [] as number[] };
  });

  for (const expense of groupData) {
    const payerEmail = expense.user_expense_email && normalize(expense.user_expense_email);
    // Older expenses only stored a display name. Accept only a unique matching member.
    const payerName = normalize(expense.user_expense_name);
    const matches = members.filter(member => payerEmail
      ? member.email === payerEmail
      : member.email === payerName || member.email.split("@")[0] === payerName ||
        (member.email === currentEmail && normalize(displayName) === payerName));
    if (matches.length !== 1) {
      throw new Error(`Cannot identify the payer for “${expense.user_expense_description || expense.user_expense_name}”. Review this expense’s member details.`);
    }
    matches[0].expenses.push(expense.user_expense_amount);
    matches[0].name = expense.user_expense_name;
  }

  return members.map(member => ({
    name: member.email === currentEmail ? "You" :
      member.name === "You" || members.some(other => other.email !== member.email && other.name === member.name)
        ? member.email : member.name,
    expenses: member.expenses,
  }));
};

export function calculateOwes(people: People[]): Transaction[] {
  if (!people.length) return [];
  const totals = people.map(person => person.expenses.reduce((sum, expense) => sum + Math.round(expense * 100), 0));
  const total = totals.reduce((sum, paid) => sum + paid, 0);
  const share = Math.floor(total / people.length);
  const remainder = total % people.length;
  // Allocate leftover cents in member order so every cent has exactly one owner.
  const balances = totals.map((paid, index) => paid - share - (index < remainder ? 1 : 0));
  const transactions: Transaction[] = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = 0; balances[i] < 0 && j < people.length; j++) {
      if (balances[j] <= 0) continue;
      const cents = Math.min(-balances[i], balances[j]);
      balances[i] += cents;
      balances[j] -= cents;
      transactions.push({ from: people[i].name, to: people[j].name, amount: cents / 100 });
    }
  }
  return transactions;
}

export const generateBalanceSummaryStatement = <T extends Transaction>(
  transactions: T[],
  id?:any,
  currentName?:string
): BalanceSummary[] => {
  
  const intId = parseInt(id)
  
  const results = transactions.map((transaction,i) =>
    transaction.from === "You"
      ? {
          userString: `${transaction.from} owe ${
            transaction.to
          }`,
          userNumber: Number(transaction.amount.toFixed(2)),
          groupId: intId ? intId+i : i,
          groupName: currentName,
        }
      : {
          userString: `${transaction.from} owes ${
            transaction.to
          }`,
          userNumber: Number(transaction.amount.toFixed(2)),
          groupId: intId ? intId+i : i,
          groupName: currentName,
        }
  );

  return results.length > 0 ? results : [{userString: "All people are settled up", userNumber: 0, groupId: intId,
  groupName:currentName}];
};

export const formatSettlementStatement = (statement: string) =>
  statement.replace(/ owes? /, " paid ");

export const generateBalanceSettleUpStatement = <T extends Transaction>(
  transactions: T[]
): BalanceSummary[] => {
  const results = transactions.map((transaction) =>
    transaction.from === "You"
      ? {
          userString: `${transaction.from} paied ${
            transaction.to
          }`,
          userNumber: Number(transaction.amount.toFixed(2)),
        }
      : {
          userString: `${transaction.from} paied ${
            transaction.to
          }`,
          userNumber: Number(transaction.amount.toFixed(2)),
        }
  );

  return results.length > 0 ? results : [{userString: "All people are settled up", userNumber: 0}];
};

export const getFormattedDate = (seconds: number, nanoseconds: number) => {
  const totalMilliseconds = (seconds * 1000) + (nanoseconds / 1000000);
  const createdAtDate = new Date(totalMilliseconds);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const monthIndex = createdAtDate.getMonth();
  const day = createdAtDate.getDate();

  let daySuffix = "th";
  if (day < 11 || day > 13) {  // Only change suffix if outside 11-13 range
    switch (day % 10) {
      case 1:
        daySuffix = "st";
        break;
      case 2:
        daySuffix = "nd";
        break;
      case 3:
        daySuffix = "rd";
        break;
    }
  }

  return `${monthNames[monthIndex]} ${day}${daySuffix}`;
}

export const totalUserExpenses = (expenses) => {
  return expenses?.reduce((acc, expense) => {
    const existingExpense = acc.find(
      (item) => item.user_expense_name === expense.user_expense_name
    );
    if (existingExpense) {
      existingExpense.user_expense_amount += expense.user_expense_amount;
    } else {
      acc.push({
        user_expense_name: expense.user_expense_name,
        user_expense_amount: expense.user_expense_amount,
      });
    }
    return acc;
  }, []);
}


export function getPersonalBalance(statements: BalanceSummary[]) {
  const owed = statements.filter(statement => statement.userString.endsWith("owes You")).reduce((sum, statement) => sum + statement.userNumber, 0);
  const owing = statements.filter(statement => statement.userString.startsWith("You owe ")).reduce((sum, statement) => sum + statement.userNumber, 0);
  return { owed, owing, net: owed - owing };
}
