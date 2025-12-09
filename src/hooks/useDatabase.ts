import { SavedExpenseSession } from "@/lib/types/database";

export const useDatabase = () => {
  const saveExpenseSession = async (
    session: Omit<SavedExpenseSession, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/expense-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error("Failed to save expense session");
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving expense session:", error);
      throw error;
    }
  };

  const getExpenseSessions = async () => {
    try {
      const response = await fetch("/api/expense-sessions");

      if (!response.ok) {
        throw new Error("Failed to fetch expense sessions");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching expense sessions:", error);
      throw error;
    }
  };

  return {
    saveExpenseSession,
    getExpenseSessions,
  };
};
