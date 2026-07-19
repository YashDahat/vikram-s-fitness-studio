import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  logProgressMetric,
  getProgressMetrics,
  logWorkout,
  getWorkoutLogs,
} from '@/services/progressService';
import type { ProgressMetricDto, WorkoutLogDto } from '@/types/progress';

export const useProgress = () => {
  const queryClient = useQueryClient();

  const {
    data: progressMetrics,
    isLoading: isLoadingProgressMetrics,
    error: progressMetricsError,
  } = useQuery<ProgressMetricDto[]>({
    queryKey: ['progressMetrics'],
    queryFn: getProgressMetrics,
  });

  const {
    data: workoutLogs,
    isLoading: isLoadingWorkoutLogs,
    error: workoutLogsError,
  } = useQuery<WorkoutLogDto[]>({
    queryKey: ['workoutLogs'],
    queryFn: getWorkoutLogs,
  });

  const logProgressMetricMutation = useMutation({
    mutationFn: logProgressMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressMetrics'] });
    },
  });

  const logWorkoutMutation = useMutation({
    mutationFn: logWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
    },
  });

  return {
    progressMetrics: progressMetrics ?? [],
    workoutLogs: workoutLogs ?? [],
    isLoading: isLoadingProgressMetrics || isLoadingWorkoutLogs || logProgressMetricMutation.isPending || logWorkoutMutation.isPending,
    error: progressMetricsError || workoutLogsError || logProgressMetricMutation.error || logWorkoutMutation.error,
    logWorkout: logWorkoutMutation.mutateAsync,
    logProgressMetric: logProgressMetricMutation.mutateAsync,
  };
};