export interface SelectedType {
  id: string;
  user_group_name: string;
  user_group_email: string[];
}

export interface AuthValues {
  password: string;
  email: string;
}

export interface BalanceSummary {
  userString: string;
  userNumber: number;
  groupId?: any;
}

export interface UserGroup {
  id: string;
  user_group_id: string;
  user_group_name: string;
  user_expense_description: string;
  user_expense_amount: number;
  user_expense_name: string;
  settled_up: boolean;
  expenseGroupsArray:string[]
  user_group_email:string[]
  created_at: {
    nanoseconds: number;
    seconds: number;
  };
}

export type UserGroups = UserGroup[];

export interface Values { 
    userName: string;
    userEmail: string;
}

export interface GroupExpenses {
  userString: string; 
  userNumber: number;
  groupId: string
}

interface UserTotalsArray {
  user_expense_name: string;
  user_expense_amount: number;
}

export interface UserGroupTotals {
id: string;
user_group_name:string;
user_group_totals: UserTotalsArray[];
}

export interface People {
  name: string;
  expenses: number[];
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}