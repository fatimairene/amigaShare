"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ExpenseResult } from "@/components/shared/types";
import { useDatabase } from "@/hooks/useDatabase";

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveExpenseSession } = useDatabase();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Get the encoded results from URL params
  const resultsJson = searchParams.get("data");
  const calculatedTotal = searchParams.get("total");
  const divisionMode = searchParams.get("mode") as
    | "individual"
    | "daily-split"
    | "equal"
    | undefined;
  const totalDaysUsed = searchParams.get("days");

  if (!resultsJson || !calculatedTotal) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No results data found
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Calculator
            </button>
          </div>
        </div>
      </div>
    );
  }

  let results: ExpenseResult[] = [];
  try {
    results = JSON.parse(decodeURIComponent(resultsJson));
  } catch (error) {
    console.error("Failed to parse results:", error);
  }

  const handleSaveSession = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Create a session name with timestamp
      const now = new Date();
      const sessionName = `Gastos ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      await saveExpenseSession({
        name: sessionName,
        totalExpense: parseFloat(calculatedTotal),
        divisionMode: divisionMode || "individual",
        globalDays: parseFloat(totalDaysUsed || "0"),
        participants: [],
        subExpenses: [],
        results: results,
      });

      setSaveMessage("✅ Session saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving session:", error);
      setSaveMessage("❌ Error saving session");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => router.push("/splitHouse")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            ← Back to Calculator
          </button>
          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isSaving ? "Saving..." : "💾 Save Session"}
          </button>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              {saveMessage}
            </p>
          </div>
        )}

        <ResultsDisplay
          results={results}
          calculatedTotal={parseFloat(calculatedTotal)}
          divisionMode={divisionMode}
        />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ResultsPageContent />
    </Suspense>
  );
}
