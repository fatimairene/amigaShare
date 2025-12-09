"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ExpenseResult } from "@/components/shared/types";

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ← Back to Calculator
        </button>

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
