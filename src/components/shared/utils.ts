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
  divisionMode: "individual" | "daily-split" | "equal",
  globalDays: number
) {
  const validParticipants = participants.filter(
    (p) => p.name.trim() !== "" && p.daysStaying > 0
  );

  return validParticipants.map((p) => {
    let baseShare: number;
    let percentage: number;

    if (divisionMode === "equal") {
      // Equal split among all participants
      baseShare = totalExpense / validParticipants.length;
      percentage = (1 / validParticipants.length) * 100;
    } else if (divisionMode === "daily-split") {
      // Split by day: divide cost by number of unique days, then by people present that day
      const totalDays = Math.max(
        ...validParticipants.map((p) => p.daysStaying),
        1
      );
      const costPerDay = totalExpense / totalDays;

      // Count how many people are present on each day this person stays
      let totalCostForThisPerson = 0;
      for (let day = 1; day <= p.daysStaying; day++) {
        // Count people present on this day
        const peopleOnThisDay = validParticipants.filter(
          (participant) => participant.daysStaying >= day
        ).length;
        totalCostForThisPerson += costPerDay / peopleOnThisDay;
      }
      baseShare = totalCostForThisPerson;
      percentage = (baseShare / totalExpense) * 100;
    } else {
      // Individual mode: proportional to days stayed (original method)
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
