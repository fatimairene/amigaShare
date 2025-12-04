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

  return validParticipants.map((p) => {
    let baseShare: number;
    let percentage: number;

    if (divisionMode === "global") {
      // In global mode, calculate total person-days
      // Then divide expense by total person-days to get cost per person-day
      // Each person pays: cost per person-day × their days staying
      const totalPersonDays = validParticipants.reduce(
        (sum, participant) => sum + participant.daysStaying,
        0
      );
      const costPerPersonDay = totalExpense / totalPersonDays;
      baseShare = costPerPersonDay * p.daysStaying;
      percentage = (p.daysStaying / totalPersonDays) * 100;
    } else {
      // In individual mode, divide by total days
      const totalDays = validParticipants.reduce(
        (sum, participant) => sum + participant.daysStaying,
        0
      );
      baseShare = (totalExpense * p.daysStaying) / totalDays;
      percentage = (p.daysStaying / totalDays) * 100;
    }

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
      percentage,
    };
  });
}
