interface TotalExpenseInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TotalExpenseInput({ value, onChange }: TotalExpenseInputProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Total Expense Amount
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          €
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter total expense"
          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}

interface DivisionModeProps {
  mode: "individual" | "global";
  globalDays: string;
  onModeChange: (mode: "individual" | "global") => void;
  onGlobalDaysChange: (days: string) => void;
}

export function DivisionModeSelector({
  mode,
  globalDays,
  onModeChange,
  onGlobalDaysChange,
}: DivisionModeProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Division Method
      </label>
      <div className="space-y-4">
        <label
          className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all"
          style={{
            borderColor: mode === "individual" ? "#3b82f6" : "#e5e7eb",
            backgroundColor: mode === "individual" ? "#eff6ff" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={mode === "individual"}
            onChange={() => onModeChange("individual")}
            className="w-4 h-4 mt-1 cursor-pointer accent-blue-500"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Sum of Individual Days
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each person pays based on their portion of total days. Example:
              €600 with 2 people × 3 days each (6 total days) = €100/day each
            </p>
          </div>
        </label>

        <label
          className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all"
          style={{
            borderColor: mode === "global" ? "#3b82f6" : "#e5e7eb",
            backgroundColor: mode === "global" ? "#eff6ff" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={mode === "global"}
            onChange={() => onModeChange("global")}
            className="w-4 h-4 mt-1 cursor-pointer accent-blue-500"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              Global Days (Equal Split)
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Divide expense equally among participants. Example: €870 with 2
              people = €435 each
            </p>
            {mode === "global" && (
              <input
                type="number"
                value={globalDays}
                onChange={(e) => onGlobalDaysChange(e.target.value)}
                placeholder="Enter total days (informational)"
                className="w-full sm:w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                min="1"
                step="1"
              />
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
      {message}
    </div>
  );
}

interface ActionButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
}

export function ActionButtons({ onCalculate, onReset }: ActionButtonsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onCalculate}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
      >
        Calculate Shares
      </button>
      <button
        onClick={onReset}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        Reset
      </button>
    </div>
  );
}
