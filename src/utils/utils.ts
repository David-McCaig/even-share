import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
interface UserGroup {
  id: string;
  user_group_id: string;
  user_group_name: string;
  user_expense_description: string;
  user_expense_amount: number;
  user_expense_name: string;
}

type UserGroups = UserGroup[];

interface People {
  name: string;
  expenses: number[];
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

interface BalanceSummary {
  userString: string;
  userNumber: number;
}
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createUserObject = (groupData: UserGroups, displayName: string) => {
  const expenseData: { name: string; expenses: number[] }[] = [];
  groupData?.filter((expense) => {
    if (expenseData.length === 0) {
      expenseData.push({
        name: expense.user_expense_name,
        expenses: [expense.user_expense_amount],
      });
    } else {
      const userExists = expenseData.find(
        (user) => user.name === expense.user_expense_name
      );
      if (userExists) {
        userExists.expenses.push(expense.user_expense_amount);
      } else {
        expenseData.push({
          name: expense.user_expense_name,
          expenses: [expense.user_expense_amount],
        });
      }
    }
  });
  expenseData.find((info) => {
    if (info.name === displayName) {
      info.name = "You";
    }
  });
  return expenseData;
};

export   function calculateOwes(people: People[], displayName: string) {
  const numPeople = people.length;

  const totalExpenses = people.map((person) =>
    person.expenses.reduce((acc: number, expense: number) => acc + expense, 0)
  );

  const totalExpenseSum = totalExpenses.reduce(
    (acc: number, total: number) => acc + total,
    0
  );
  const averageExpense = totalExpenseSum / numPeople;
  const balances = new Array(numPeople).fill(0);
  for (let i = 0; i < numPeople; i++) {
    balances[i] = totalExpenses[i] - averageExpense;
  }

  const transactions = [];

  for (let i = 0; i < numPeople; i++) {
    if (balances[i] < 0) {
      for (let j = 0; j < numPeople; j++) {
        if (balances[j] > 0) {
          const transferAmount = Math.min(Math.abs(balances[i]), balances[j]);
          balances[i] += transferAmount;
          balances[j] -= transferAmount;
          transactions.push({
            from:
              people[i].name === displayName ? "You" : people[i].name,
            to: people[j].name === displayName ? "You" : people[j].name,
            amount: transferAmount,
          });
        }
      }
    }
  }
  return transactions;
}

export const generateBalanceSummaryStatement = <T extends Transaction>(
  transactions: T[]
): BalanceSummary[] | string => {
  const results = transactions.map((transaction) =>
    transaction.from === "You"
      ? {
          userString: `${transaction.from?.split(" ")[0]} owe ${
            transaction.to
          }`,
          userNumber: parseInt(transaction.amount.toFixed(2)),
        }
      : {
          userString: `${transaction.from?.split(" ")[0]} owes ${
            transaction.to
          }`,
          userNumber: parseInt(transaction.amount.toFixed(2)),
        }
  );

  return results.length > 0 ? results : [{userString: "All people are settled up", userNumber: 0}];
};

export const generateBalanceSettleUpStatement = <T extends Transaction>(
  transactions: T[]
): BalanceSummary[] | string => {
  const results = transactions.map((transaction) =>
    transaction.from === "You"
      ? {
          userString: `${transaction.from?.split(" ")[0]} paied ${
            transaction.to
          }`,
          userNumber: parseInt(transaction.amount.toFixed(2)),
        }
      : {
          userString: `${transaction.from?.split(" ")[0]} paied ${
            transaction.to
          }`,
          userNumber: parseInt(transaction.amount.toFixed(2)),
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
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    
    switch (day % 10) {
      case 1:
       return `${monthNames[monthIndex]} ${day}st`;
      case 2:
       return `${monthNames[monthIndex]} ${day}nd`;
      case 3:
        return `${monthNames[monthIndex]} ${day}rd`;
      default:
        return `${monthNames[monthIndex]} ${day}th`;
    }
}
