import { SubExpense, Participant } from "./types";

interface SubExpenseItemProps {
  subExpense: SubExpense;
  participants: Participant[];
  onUpdate: (
    id: string,
    field: "name" | "amount" | "splitMode",
    value: string | number
  ) => void;
  onRemove: (id: string) => void;
  onToggleParticipant: (subExpenseId: string, participantId: string) => void;
}

export function SubExpenseItem({
  subExpense,
  participants,
  onUpdate,
  onRemove,
  onToggleParticipant,
}: SubExpenseItemProps) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex flex-col gap-4">
        {/* Charge name and amount */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            value={subExpense.name}
            onChange={(e) => onUpdate(subExpense.id, "name", e.target.value)}
            placeholder="Charge name (e.g., Kids fee)"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gray-500 dark:text-gray-400">$</span>
            <input
              type="number"
              value={subExpense.amount}
              onChange={(e) =>
                onUpdate(subExpense.id, "amount", e.target.value)
              }
              placeholder="Amount"
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-right"
              min="0"
              step="0.01"
            />
          </div>
          <button
            onClick={() => onRemove(subExpense.id)}
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
                        onToggleParticipant(subExpense.id, participant.id)
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
                      onUpdate(subExpense.id, "splitMode", "individual")
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
                      onUpdate(subExpense.id, "splitMode", "divided")
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
  );
}

interface SubExpensesListProps {
  subExpenses: SubExpense[];
  participants: Participant[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: "name" | "amount" | "splitMode",
    value: string | number
  ) => void;
  onToggleParticipant: (subExpenseId: string, participantId: string) => void;
}

export function SubExpensesList({
  subExpenses,
  participants,
  onAdd,
  onRemove,
  onUpdate,
  onToggleParticipant,
}: SubExpensesListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Additional Charges
        </h2>
        <button
          onClick={onAdd}
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
            <SubExpenseItem
              key={subExpense.id}
              subExpense={subExpense}
              participants={participants}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onToggleParticipant={onToggleParticipant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
