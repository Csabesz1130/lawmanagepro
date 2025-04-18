export interface Invoice {
  id: string;
  invoiceId?: string;
  invoiceNumber: string;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate?: string;
  client?: {
    name: string;
    address?: string;
    email?: string;
  };
  organization?: {
    name: string;
  };
  timeEntries?: Array<{
    id: string;
    description: string;
    duration: number;
    amount: number;
    user?: {
      name: string;
    };
  }>;
  expenses?: Array<{
    id: string;
    description: string;
    amount: number;
    date?: string;
    user?: {
      name: string;
    };
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
  }>;
  notes?: string;
}