// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface BookingDto {
  id: number | null;
  userId: number | null;
  fitnessClassId: number | null;
  bookingTime: string | null;
  status: BookingStatus | null;
}

export interface CreateBookingRequest {
  fitnessClassId: number | null;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

