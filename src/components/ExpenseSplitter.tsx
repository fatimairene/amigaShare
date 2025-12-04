"use client";

import { useState } from "react";
import { Participant, SubExpense, ExpenseResult } from "./types";
import { generateId, calculateExpenseShares } from "./utils";
import {
  TotalExpenseInput,
  DivisionModeSelector,
  ErrorMessage,
  ActionButtons,
} from "./ExpenseInputs";
import { ParticipantsList } from "./ParticipantsList";
import { SubExpensesList } from "./SubExpensesList";
import { ResultsDisplay } from "./ResultsDisplay";

export default function ExpenseSplitter() {
  const [totalExpense, setTotalExpense] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: generateId(), name: "", daysStaying: 1 },
  ]);
  const [subExpenses, setSubExpenses] = useState<SubExpense[]>([]);
  const [results, setResults] = useState<ExpenseResult[]>([]);
  const [error, setError] = useState<string>("");
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const [divisionMode, setDivisionMode] = useState<"individual" | "global">(
    "individual"
  );
  const [globalDays, setGlobalDays] = useState<string>("");

  // Participant handlers
  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { id: generateId(), name: "", daysStaying: 1 },
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const handleUpdateParticipant = (
    id: string,
    field: "name" | "daysStaying",
    value: string | number
  ) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    if (error) setError("");
  };

  // Sub-expense handlers
  const handleAddSubExpense = () => {
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

  const handleRemoveSubExpense = (id: string) => {
    setSubExpenses(subExpenses.filter((se) => se.id !== id));
  };

  const handleUpdateSubExpense = (
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

  const handleToggleSubExpenseParticipant = (
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

  // Calculation
  const handleCalculateShares = () => {
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

    if (divisionMode === "global") {
      const globalDaysNum = parseFloat(globalDays);
      if (isNaN(globalDaysNum) || globalDaysNum <= 0) {
        setError("Please enter a valid number of global days");
        setResults([]);
        return;
      }
    }

    setError("");
    setCalculatedTotal(expense);

    const globalDaysNum =
      divisionMode === "global" ? parseFloat(globalDays) : 0;
    const calculatedResults = calculateExpenseShares(
      expense,
      validParticipants,
      subExpenses,
      divisionMode,
      globalDaysNum
    );

    setResults(calculatedResults);
  };

  // Reset
  const handleReset = () => {
    setTotalExpense("");
    setParticipants([{ id: generateId(), name: "", daysStaying: 1 }]);
    setSubExpenses([]);
    setResults([]);
    setError("");
    setCalculatedTotal(0);
    setDivisionMode("individual");
    setGlobalDays("");
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
      <TotalExpenseInput value={totalExpense} onChange={setTotalExpense} />

      {/* Division Mode */}
      <DivisionModeSelector
        mode={divisionMode}
        globalDays={globalDays}
        onModeChange={setDivisionMode}
        onGlobalDaysChange={setGlobalDays}
      />

      {/* Error Message */}
      <ErrorMessage message={error} />

      {/* Participants */}
      <ParticipantsList
        participants={participants}
        onAdd={handleAddParticipant}
        onRemove={handleRemoveParticipant}
        onUpdate={handleUpdateParticipant}
      />

      {/* Sub-Expenses */}
      <SubExpensesList
        subExpenses={subExpenses}
        participants={participants}
        onAdd={handleAddSubExpense}
        onRemove={handleRemoveSubExpense}
        onUpdate={handleUpdateSubExpense}
        onToggleParticipant={handleToggleSubExpenseParticipant}
      />

      {/* Action Buttons */}
      <ActionButtons
        onCalculate={handleCalculateShares}
        onReset={handleReset}
      />

      {/* Results */}
      <ResultsDisplay results={results} calculatedTotal={calculatedTotal} />
    </div>
  );
}
