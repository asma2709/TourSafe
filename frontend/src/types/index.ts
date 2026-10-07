export interface Tourist {
  id: number;
  name: string;
  email: string;
  phone: string;
  passType: string;
  createdAt?: string;
}

export interface SosAlert {
  id: number;
  touristId: number;
  touristName?: string;
  latitude: number;
  longitude: number;
  location?: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface SafetyZone {
  id: number;
  zoneName: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: string;
}

export interface RescueResponse {
  id: number;
  rescueTeam: string;
  sosAlertId: number;
  location: string;
  latitude?: number;
  longitude?: number;
  estimatedCost: number;
  status: string;
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
}

export interface Account {
  id: number;
  accountName: string;
  accountType: string;
  balance: number;
}

export interface Transaction {
  id: number;
  type: string;
  description: string;
  amount: number;
  accountId: number;
  accountName?: string;
  transactionDate: string;
}

export interface Budget {
  id: number;
  category: string;
  amount: number;
  year: number;
}

export interface FinancialReport {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalBudget: number;
}

export interface DashboardSummary {
  totalTourists: number;
  activeSosAlerts: number;
  activeSafetyZones: number;
  rescueResponses: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalBudget: number;
}
