export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  matterId: string;
  userId: string;
  invoiceId?: string;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  date: string;
  matterId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  total: string;
  status: string;
  dueDate: string;
  client: { name: string };
  matter: { title: string };
  payments: any[];
}

export interface OrganizationUpdateInput {
  stripePublicKey: string;
  stripeSecretKey: string;
}

export type { Expense, ExpenseInput, OrganizationUpdateInput };