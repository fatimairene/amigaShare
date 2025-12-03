"use client";

import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  daysStaying: number;
}

interface SubExpense {
  id: string;
  name: string;
  amount: number;
  applicableParticipantIds: string[];
  splitMode: "individual" | "divided";
}

interface ExpenseResult {
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
  const [subExpenses, setSubExpenses] = useState<SubExpense[]>([]);
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

  const addSubExpense = () => {
    setSubExpenses([
      ...subExpenses,
      {
        id: generateId(),
        name: "",
        amount: 0,
        applicableParticipantIds: [],
        splitMode: "individual",
      },
    ]);
  };

  const removeSubExpense = (id: string) => {
    setSubExpenses(subExpenses.filter((se) => se.id !== id));
  };

  const updateSubExpense = (
    id: string,
    field: "name" | "amount" | "splitMode",
    value: string | number
  ) => {
    setSubExpenses(
      subExpenses.map((se) =>
        se.id === id
          ? {
              ...se,
              [field]:
                field === "amount" ? parseFloat(value as string) || 0 : value,
            }
          : se
      )
    );
  };

  const toggleSubExpenseParticipant = (
    subExpenseId: string,
    participantId: string
  ) => {
    setSubExpenses(
      subExpenses.map((se) =>
        se.id === subExpenseId
          ? {
              ...se,
              applicableParticipantIds: se.applicableParticipantIds.includes(
                participantId
              )
                ? se.applicableParticipantIds.filter(
                    (id) => id !== participantId
                  )
                : [...se.applicableParticipantIds, participantId],
            }
          : se
      )
    );
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
      setError(
        "Please add at least one participant with a name and days staying"
      );
      setResults([]);
      return;
    }

    setError("");
    setCalculatedTotal(expense);

    const totalDays = validParticipants.reduce(
      (sum, p) => sum + p.daysStaying,
      0
    );

    const calculatedResults: ExpenseResult[] = validParticipants.map((p) => {
      const baseShare = (expense * p.daysStaying) / totalDays;

      // Calculate sub-expense charges for this participant
      const subExpenseCharges = subExpenses
        .filter((se) => se.applicableParticipantIds.includes(p.id))
        .map((se) => {
          let chargeAmount = se.amount;
          if (se.splitMode === "divided") {
            // Divide the amount among all applicable participants
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
      const totalWithAllSubs =
        expense + subExpenses.reduce((sum, se) => sum + se.amount, 0);

      return {
        name: p.name,
        daysStaying: p.daysStaying,
        baseShare,
        subExpenseCharges,
        totalShare,
        percentage: (p.daysStaying / totalDays) * 100,
      };
    });

    setResults(calculatedResults);
  };

  const resetForm = () => {
    setTotalExpense("");
    setParticipants([{ id: generateId(), name: "", daysStaying: 1 }]);
    setSubExpenses([]);
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
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Participants
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {participants.length}
            </span>
          </div>
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

      {/* Sub-Expenses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Additional Charges
          </h2>
          <button
            onClick={addSubExpense}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Charge
          </button>
        </div>

        {subExpenses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No additional charges yet. Add charges that apply to specific
            participants (e.g., kids fee).
          </p>
        ) : (
          <div className="space-y-4">
            {subExpenses.map((subExpense) => (
              <div
                key={subExpense.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex flex-col gap-4">
                  {/* Charge name and amount */}
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      value={subExpense.name}
                      onChange={(e) =>
                        updateSubExpense(subExpense.id, "name", e.target.value)
                      }
                      placeholder="Charge name (e.g., Kids fee)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-gray-500 dark:text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={subExpense.amount}
                        onChange={(e) =>
                          updateSubExpense(
                            subExpense.id,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="Amount"
                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-right"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button
                      onClick={() => removeSubExpense(subExpense.id)}
                      className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
                      title="Remove charge"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Participant checkboxes */}
                  {participants.some((p) => p.name.trim() !== "") && (
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Applies to:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {participants
                          .filter((p) => p.name.trim() !== "")
                          .map((participant) => (
                            <label
                              key={participant.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={subExpense.applicableParticipantIds.includes(
                                  participant.id
                                )}
                                onChange={() =>
                                  toggleSubExpenseParticipant(
                                    subExpense.id,
                                    participant.id
                                  )
                                }
                                className="w-4 h-4 rounded cursor-pointer accent-purple-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {participant.name}
                              </span>
                            </label>
                          ))}
                      </div>

                      {/* Split mode toggle */}
                      <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-500 pt-3">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Charge mode:
                        </p>
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={subExpense.splitMode === "individual"}
                              onChange={() =>
                                updateSubExpense(
                                  subExpense.id,
                                  "splitMode",
                                  "individual"
                                )
                              }
                              className="w-4 h-4 cursor-pointer accent-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Per Person
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={subExpense.splitMode === "divided"}
                              onChange={() =>
                                updateSubExpense(
                                  subExpense.id,
                                  "splitMode",
                                  "divided"
                                )
                              }
                              className="w-4 h-4 cursor-pointer accent-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Divided
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
                ${results.reduce((sum, r) => sum + r.totalShare, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
