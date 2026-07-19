// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface BlogPostDto {
  id: string | null;
  title: string | null;
  content: string | null;
  author: string | null;
  publicationDate: string | null;
  lastModifiedDate: string | null;
}

export interface WorkoutLogDto {
  id: number | null;
  date: string | null;
  description: string | null;
  exercises: string | null;
}

