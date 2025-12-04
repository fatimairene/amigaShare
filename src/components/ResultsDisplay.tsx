import { ExpenseResult } from "./types";

interface ResultsDisplayProps {
  results: ExpenseResult[];
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (results.length === 0) return null;

  const grandTotal = results.reduce((sum, r) => sum + r.totalShare, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💰 Expense Breakdown
      </h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {result.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({result.daysStaying} day
                  {result.daysStaying !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            {/* Base share */}
            <div className="flex justify-between items-center text-sm mb-2 pl-4">
              <span className="text-gray-600 dark:text-gray-300">
                Base share ({result.percentage.toFixed(1)}%)
              </span>
              <span className="text-gray-900 dark:text-white">
                ${result.baseShare.toFixed(2)}
              </span>
            </div>

            {/* Sub-expense charges */}
            {result.subExpenseCharges.map((charge, chargeIndex) => (
              <div
                key={chargeIndex}
                className="flex justify-between items-center text-sm mb-2 pl-4 text-purple-600 dark:text-purple-400"
              >
                <span>
                  {charge.name}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({charge.splitMode === "divided" ? "÷" : "✕"})
                  </span>
                </span>
                <span>+${charge.amount.toFixed(2)}</span>
              </div>
            ))}

            {/* Total for this person */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600 pl-4">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Total
              </span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                ${result.totalShare.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div className="mt-4 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            Grand Total
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
