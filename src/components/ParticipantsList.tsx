"use client";

import { useState } from "react";
import { Participant } from "./shared/types";
import { AddParticipantModal } from "./AddParticipantModal";

interface ParticipantsListProps {
  participants: Participant[];
  onAdd: (name: string, daysStaying: number) => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: "name" | "daysStaying",
    value: string | number
  ) => void;
}

export function ParticipantsList({
  participants,
  onAdd,
  onRemove,
  onUpdate,
}: ParticipantsListProps) {
  const [showModal, setShowModal] = useState(false);

  const handleAddParticipant = (name: string, daysStaying: number) => {
    onAdd(name, daysStaying);
    setShowModal(false);
  };
  return (
    <>
      <AddParticipantModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddParticipant}
        existingParticipants={participants}
      />
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
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Person
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Enter each person's name and how many days they will stay. The expense
          will be divided proportionally based on their days.
        </p>{" "}
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
                  onUpdate(participant.id, "name", e.target.value)
                }
                placeholder="Person's name"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={participant.daysStaying}
                  onChange={(e) =>
                    onUpdate(
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
                onClick={() => onRemove(participant.id)}
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
    </>
  );
}
