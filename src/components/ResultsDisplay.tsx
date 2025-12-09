import { ExpenseResult } from "./shared/types";

interface ResultsDisplayProps {
  results: ExpenseResult[];
  calculatedTotal: number;
  divisionMode?: "individual" | "daily-split" | "equal";
}

export function ResultsDisplay({
  results,
  calculatedTotal,
  divisionMode = "individual",
}: ResultsDisplayProps) {
  if (results.length === 0) return null;

  const grandTotal = results.reduce((sum, r) => sum + r.totalShare, 0);
  const totalDaysFromResults = results.reduce(
    (sum, r) => sum + r.daysStaying,
    0
  );
  const maxDays = Math.max(...results.map((r) => r.daysStaying), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        💰 Expense Breakdown
      </h2>

      {/* Calculation Info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
          <span className="font-semibold">How it's calculated:</span>{" "}
          {divisionMode === "equal"
            ? `${calculatedTotal.toFixed(2)}€ ÷ ${results.length} people = ${(
                calculatedTotal / results.length
              ).toFixed(2)}€ per person`
            : divisionMode === "daily-split"
            ? `${calculatedTotal.toFixed(
                2
              )}€ ÷ ${maxDays} days, then each day divided equally among people present`
            : `${calculatedTotal.toFixed(
                2
              )}€ ÷ ${totalDaysFromResults} total days (sum of everyone's days) = ${(
                calculatedTotal / totalDaysFromResults
              ).toFixed(2)}€ per day`}
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          {divisionMode === "equal"
            ? "💡 Everyone pays the same amount"
            : divisionMode === "daily-split"
            ? "💡 People pay based on who else is present their days"
            : "💡 Each person pays this rate × their own days"}
        </p>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                #
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                Name
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                Days
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                Base
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-300 font-medium">
                  {index + 1}
                </td>
                <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">
                  {result.name}
                </td>
                <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-300">
                  {result.daysStaying}
                </td>
                <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                  {result.baseShare.toFixed(2)}€
                </td>
                <td className="py-3 px-2 text-right font-semibold text-green-600 dark:text-green-400">
                  {result.totalShare.toFixed(2)}€
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sub-expenses details (if any) */}
      {results.some((r) => r.subExpenseCharges.length > 0) && (
        <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase">
            Sub-expense Details
          </p>
          <div className="space-y-2">
            {results.map(
              (result, index) =>
                result.subExpenseCharges.length > 0 && (
                  <div
                    key={index}
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.name}:
                    </span>
                    {result.subExpenseCharges.map((charge, chargeIndex) => (
                      <div key={chargeIndex} className="ml-4">
                        {charge.name}{" "}
                        <span className="text-purple-600 dark:text-purple-400">
                          ({charge.splitMode === "divided" ? "÷" : "✕"})
                        </span>{" "}
                        +{charge.amount.toFixed(2)}€
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {/* Grand total */}
      <div className="mt-6 pt-6 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">
          Grand Total
        </span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {grandTotal.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}
