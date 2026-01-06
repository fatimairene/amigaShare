"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types/user";

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, daysStaying: number) => void;
  existingParticipants: { name: string }[];
}

export function AddParticipantModal({
  isOpen,
  onClose,
  onAdd,
  existingParticipants,
}: AddParticipantModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"select" | "manual">("select"); // select from list or type manually
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [manualName, setManualName] = useState("");
  const [daysStaying, setDaysStaying] = useState<number | string>(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setMode("select");
      setSelectedUser(null);
      setManualName("");
      setDaysStaying(1);
      setError("");
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();
      const sortedUsers = (data.data || []).sort((a: User, b: User) => {
        const nameA = `${a.name} ${a.surname}`.toLowerCase();
        const nameB = `${b.name} ${b.surname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setUsers(sortedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    let nameToAdd = "";

    if (mode === "select") {
      if (!selectedUser) {
        setError("Please select a friend");
        return;
      }
      nameToAdd = `${selectedUser.name} ${selectedUser.surname}`;
    } else {
      if (!manualName.trim()) {
        setError("Please enter a name");
        return;
      }
      nameToAdd = manualName.trim();
    }

    // Verificar duplicados
    const isDuplicate = existingParticipants.some(
      (p) => p.name.toLowerCase() === nameToAdd.toLowerCase()
    );

    if (isDuplicate) {
      setError(`${nameToAdd} is already in the participants list`);
      return;
    }

    onAdd(nameToAdd, daysStaying);
    setSelectedUser(null);
    setManualName("");
    setDaysStaying(1);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add Participant
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Mode selector */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => {
              setMode("select");
              setError("");
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === "select"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            My Friends
          </button>
          <button
            onClick={() => {
              setMode("manual");
              setError("");
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Other Person
          </button>
        </div>

        {/* Select mode */}
        {mode === "select" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select a friend
            </label>
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : users.length > 0 ? (
              <select
                value={selectedUser?._id || ""}
                onChange={(e) => {
                  const user = users.find((u) => u._id === e.target.value);
                  setSelectedUser(user || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">-- Select --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} {user.surname}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No users registered
              </div>
            )}
          </div>
        )}

        {/* Manual mode */}
        {mode === "manual" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="E.g. John Doe"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Days staying
          </label>
          <input
            type="number"
            value={daysStaying}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setDaysStaying("");
              } else {
                const num = parseInt(val) || 1;
                setDaysStaying(Math.max(1, num));
              }
            }}
            onBlur={() => {
              if (daysStaying === "" || daysStaying === 0) {
                setDaysStaying(1);
              }
            }}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={
              loading ||
              (mode === "select" && !selectedUser) ||
              (mode === "manual" && !manualName.trim())
            }
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
