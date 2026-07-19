// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface ContactRequest {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
}

export interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  receivedAt: string | null;
}

