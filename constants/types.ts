export interface BudgetEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  address: string;
  long: number;
  lat: number;
}

export interface Settings {
  display: boolean; // HochKommaStellen (display decimal places)
  roundAmounts: boolean;
  categories: string[];
}
