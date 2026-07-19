// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { GoogleReviewDto } from '@/types/review';

export const getGoogleReviews = async (): Promise<GoogleReviewDto[]> => {
  const response = await apiClient.get<GoogleReviewDto[]>('/api/v1/reviews');
  return response.data;
};

