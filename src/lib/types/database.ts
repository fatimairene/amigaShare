export interface SavedExpenseSession {
  _id?: string;
  name: string;
  totalExpense: number;
  divisionMode: "individual" | "daily-split" | "equal";
  globalDays?: number;
  participants: Array<{
    id: string;
    name: string;
    daysStaying: number;
  }>;
  subExpenses: Array<{
    id: string;
    name: string;
    amount: number;
    applicableParticipantIds: string[];
    splitMode: "individual" | "divided";
  }>;
  results: Array<{
    name: string;
    daysStaying: number;
    baseShare: number;
    subExpenseCharges: Array<{
      name: string;
      amount: number;
      splitMode: "individual" | "divided";
    }>;
    totalShare: number;
    percentage: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedColorSession {
  _id?: string;
  name: string;
  mode: "auto" | "manual";
  people: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
