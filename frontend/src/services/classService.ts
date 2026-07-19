// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { FitnessClassDto } from '@/types/fitness';

export const getAllFitnessClasses = async (): Promise<FitnessClassDto[]> => {
  const response = await apiClient.get<FitnessClassDto[]>('/api/v1/classes');
  return response.data;
};

export const adminGetAllFitnessClasses = async (): Promise<FitnessClassDto[]> => {
  const response = await apiClient.get<FitnessClassDto[]>('/api/v1/admin/classes');
  return response.data;
};

export const getFitnessClassById = async (classId: number): Promise<FitnessClassDto> => {
  const response = await apiClient.get<FitnessClassDto>(`/api/v1/admin/classes/${classId}`);
  return response.data;
};

export const createFitnessClass = async (request: FitnessClassDto): Promise<FitnessClassDto> => {
  const response = await apiClient.post<FitnessClassDto>('/api/v1/admin/classes', request);
  return response.data;
};

export const updateFitnessClass = async (classId: number, request: FitnessClassDto): Promise<FitnessClassDto> => {
  const response = await apiClient.put<FitnessClassDto>(`/api/v1/admin/classes/${classId}`, request);
  return response.data;
};

export const deleteFitnessClass = async (classId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/v1/admin/classes/${classId}`);
};

