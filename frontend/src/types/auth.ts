// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface AuthResponse {
  token: string | null;
  username: string | null;
  roles: string[] | null;
}

export interface AuthRequest {
  username: string | null;
  password: string | null;
}

