// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface FitnessClassDto {
  id: number | null;
  name: string | null;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  instructor: string | null;
  maxCapacity: number | null;
  currentBookedSlots: number | null;
}

