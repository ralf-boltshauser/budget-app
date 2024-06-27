export interface BudgetEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

export interface Settings {
  display: boolean; // HochKommaStellen (display decimal places)
  roundAmounts: boolean;
  categories: string[];
}
