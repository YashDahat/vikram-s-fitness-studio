// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { ProgressMetricDto } from '@/types/progress';

export const logProgressMetric = async (request: ProgressMetricDto): Promise<ProgressMetricDto> => {
  const response = await apiClient.post<ProgressMetricDto>('/api/v1/progress/metrics', request);
  return response.data;
};

export const getProgressMetrics = async (): Promise<ProgressMetricDto[]> => {
  const response = await apiClient.get<ProgressMetricDto[]>('/api/v1/progress/metrics');
  return response.data;
};

