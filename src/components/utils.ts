// Simple ID generator for better browser compatibility
let idCounter = 0;
export function generateId(): string {
  return `participant-${Date.now()}-${++idCounter}`;
}

export function calculateExpenseShares(
  totalExpense: number,
  participants: { id: string; name: string; daysStaying: number }[],
  subExpenses: {
    id: string;
    name: string;
    amount: number;
    applicableParticipantIds: string[];
    splitMode: "individual" | "divided";
  }[],
  divisionMode: "individual" | "global",
  globalDays: number
) {
  const validParticipants = participants.filter(
    (p) => p.name.trim() !== "" && p.daysStaying > 0
  );

  let totalDays: number;
  if (divisionMode === "global") {
    totalDays = globalDays;
  } else {
    totalDays = validParticipants.reduce((sum, p) => sum + p.daysStaying, 0);
  }

  return validParticipants.map((p) => {
    const baseShare = (totalExpense * p.daysStaying) / totalDays;

    const subExpenseCharges = subExpenses
      .filter((se) => se.applicableParticipantIds.includes(p.id))
      .map((se) => {
        let chargeAmount = se.amount;
        if (se.splitMode === "divided") {
          chargeAmount = se.amount / se.applicableParticipantIds.length;
        }
        return {
          name: se.name,
          amount: chargeAmount,
          splitMode: se.splitMode,
        };
      });

    const subExpenseTotal = subExpenseCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    );

    const totalShare = baseShare + subExpenseTotal;

    return {
      name: p.name,
      daysStaying: p.daysStaying,
      baseShare,
      subExpenseCharges,
      totalShare,
      percentage: (p.daysStaying / totalDays) * 100,
    };
  });
}
