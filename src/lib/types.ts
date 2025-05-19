export interface FinancialEntry {
  id: string;
  type: 'income' | 'expense';
  date: string; // ISO string format
  amount: number;
  notes: string;
  category?: string; // Optional category
}

export interface OcrData {
  date: string;
  amount: number;
  category: string;
  merchant: string;
}
