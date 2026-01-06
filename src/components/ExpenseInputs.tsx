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
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          €
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter total expense"
          className="w-full pl-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}

interface DivisionModeProps {
  mode: "individual" | "daily-split" | "equal";
  globalDays: string;
  onModeChange: (mode: "individual" | "daily-split" | "equal") => void;
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
            <p
              className="font-medium text-gray-900 dark:text-white"
              style={{
                color: mode === "individual" ? "#1e40af" : undefined,
              }}
            >
              Proportional to Days Stayed
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Each person pays based on their portion of total days. Example:
              €600 with 2 people (3 days + 2 days = 5 total) = person 1 pays
              €360, person 2 pays €240
            </p>
          </div>
        </label>

        <label
          className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all"
          style={{
            borderColor: mode === "daily-split" ? "#3b82f6" : "#e5e7eb",
            backgroundColor: mode === "daily-split" ? "#eff6ff" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={mode === "daily-split"}
            onChange={() => onModeChange("daily-split")}
            className="w-4 h-4 mt-1 cursor-pointer accent-blue-500"
          />
          <div>
            <p
              className="font-medium text-gray-900 dark:text-white"
              style={{
                color: mode === "daily-split" ? "#1e40af" : undefined,
              }}
            >
              Split by Day
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cost divided by number of days, then split equally among people
              present that day. Example: €870 for 2 days with 13 people day 1
              and 11 day 2 = each person pays €33.46 or €39.55 depending on
              which day
            </p>
          </div>
        </label>

        <label
          className="flex items-start gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all"
          style={{
            borderColor: mode === "equal" ? "#3b82f6" : "#e5e7eb",
            backgroundColor: mode === "equal" ? "#eff6ff" : "transparent",
          }}
        >
          <input
            type="radio"
            checked={mode === "equal"}
            onChange={() => onModeChange("equal")}
            className="w-4 h-4 mt-1 cursor-pointer accent-blue-500"
          />
          <div className="flex-1">
            <p
              className="font-medium text-gray-900 dark:text-white"
              style={{
                color: mode === "equal" ? "#1e40af" : undefined,
              }}
            >
              Equal Split
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Divide expense equally among all participants. Example: €870 with
              2 people = €435 each
            </p>
            {mode === "equal" && (
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
