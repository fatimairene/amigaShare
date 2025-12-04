export interface Participant {
  id: string;
  name: string;
  daysStaying: number;
}

export interface SubExpense {
  id: string;
  name: string;
  amount: number;
  applicableParticipantIds: string[];
  splitMode: "individual" | "divided";
}

export interface ExpenseResult {
  name: string;
  daysStaying: number;
  baseShare: number;
  subExpenseCharges: {
    name: string;
    amount: number;
    splitMode: "individual" | "divided";
  }[];
  totalShare: number;
  percentage: number;
}
