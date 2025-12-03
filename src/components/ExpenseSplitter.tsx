"use client";

import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  daysStaying: number;
}

interface ExpenseResult {
  name: string;
  daysStaying: number;
  share: number;
  percentage: number;
}

// Simple ID generator for better browser compatibility
let idCounter = 0;
function generateId(): string {
  return `participant-${Date.now()}-${++idCounter}`;
}

export default function ExpenseSplitter() {
  const [totalExpense, setTotalExpense] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: generateId(), name: "", daysStaying: 1 },
  ]);
  const [results, setResults] = useState<ExpenseResult[]>([]);
  const [error, setError] = useState<string>("");
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: generateId(), name: "", daysStaying: 1 },
    ]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (
    id: string,
    field: "name" | "daysStaying",
    value: string | number
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    // Clear error when user starts editing
    if (error) setError("");
  };

  const calculateShares = () => {
    const expense = parseFloat(totalExpense);
    if (isNaN(expense) || expense <= 0) {
      setError("Please enter a valid total expense amount");
      setResults([]);
      return;
    }

    const validParticipants = participants.filter(
      (p) => p.name.trim() !== "" && p.daysStaying > 0
    );

    if (validParticipants.length === 0) {
      setError("Please add at least one participant with a name and days staying");
      setResults([]);
      return;
    }

    setError("");
    setCalculatedTotal(expense);

    const totalDays = validParticipants.reduce(
      (sum, p) => sum + p.daysStaying,
      0
    );

    const calculatedResults: ExpenseResult[] = validParticipants.map((p) => ({
      name: p.name,
      daysStaying: p.daysStaying,
      share: (expense * p.daysStaying) / totalDays,
      percentage: (p.daysStaying / totalDays) * 100,
    }));

    setResults(calculatedResults);
  };

  const resetForm = () => {
    setTotalExpense("");
    setParticipants([{ id: generateId(), name: "", daysStaying: 1 }]);
    setResults([]);
    setError("");
    setCalculatedTotal(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 AmigaShare
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Split expenses fairly based on how many days each person stays
        </p>
      </div>

      {/* Total Expense Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Total Expense Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            value={totalExpense}
            onChange={(e) => {
              setTotalExpense(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter total expense"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Participants */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Participants
          </h2>
          <button
            onClick={addParticipant}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Person
          </button>
        </div>

        <div className="space-y-4">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                {index + 1}.
              </span>
              <input
                type="text"
                value={participant.name}
                onChange={(e) =>
                  updateParticipant(participant.id, "name", e.target.value)
                }
                placeholder="Person's name"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={participant.daysStaying}
                  onChange={(e) =>
                    updateParticipant(
                      participant.id,
                      "daysStaying",
                      parseInt(e.target.value) || 1
                    )
                  }
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-center"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  days
                </span>
              </div>
              <button
                onClick={() => removeParticipant(participant.id)}
                disabled={participants.length === 1}
                className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed p-2"
                title="Remove participant"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={calculateShares}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Calculate Shares
        </button>
        <button
          onClick={resetForm}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 Expense Breakdown
          </h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({result.daysStaying} day{result.daysStaying !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${result.share.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({result.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Total
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${calculatedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
