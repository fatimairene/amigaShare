import { Participant } from "./types";
import { generateId } from "./utils";

export const mockParticipants: Participant[] = [
  { id: generateId(), name: "Lucia", daysStaying: 2 },
  { id: generateId(), name: "Paula", daysStaying: 2 },
  { id: generateId(), name: "Cordo", daysStaying: 2 },
  { id: generateId(), name: "Belen", daysStaying: 2 },
  { id: generateId(), name: "Mar", daysStaying: 2 },
  { id: generateId(), name: "Fatima", daysStaying: 2 },
  { id: generateId(), name: "Laura", daysStaying: 2 },
  { id: generateId(), name: "Marina", daysStaying: 2 },
  { id: generateId(), name: "Juli", daysStaying: 1 },
  { id: generateId(), name: "Yami", daysStaying: 1 },
  { id: generateId(), name: "Tania", daysStaying: 1 },
  { id: generateId(), name: "Uru", daysStaying: 1 },
];
