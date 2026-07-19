import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { useProgress } from '@/hooks/useProgress';
import type { ProgressMetricDto, WorkoutLogDto } from '@/types/progress';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const progressMetricSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  metricName: z.string().min(1, 'Metric Name is required'),
  metricValue: z.coerce.number().min(0, 'Metric Value must be positive'),
});

const workoutLogSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  exercises: z.string().min(1, 'Exercises are required'),
});

type ProgressMetricFormData = z.infer<typeof progressMetricSchema>;
type WorkoutLogFormData = z.infer<typeof workoutLogSchema>;

const ProgressTrackerForm = () => {
  const [formType, setFormType] = useState<'metric' | 'workout'>('metric');
  const { logProgressMetric, logWorkout, isLoading } = useProgress();

  const metricForm = useForm<ProgressMetricFormData>({
    resolver: zodResolver(progressMetricSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      metricName: '',
      metricValue: 0,
    },
  });

  const workoutForm = useForm<WorkoutLogFormData>({
    resolver: zodResolver(workoutLogSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      exercises: '',
    },
  });

  const handleMetricSubmit = async (data: ProgressMetricFormData) => {
    try {
      await logProgressMetric(data as ProgressMetricDto);
      toast({
        title: 'Progress Metric Logged',
        description: 'Your progress metric has been successfully recorded.',
      });
      metricForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log progress metric.',
        variant: 'destructive',
      });
    }
  };

  const handleWorkoutSubmit = async (data: WorkoutLogFormData) => {
    try {
      await logWorkout(data as WorkoutLogDto);
      toast({
        title: 'Workout Logged',
        description: 'Your workout has been successfully recorded.',
      });
      workoutForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log workout.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Log Your Progress</h2>

      <div className="mb-6">
        <Label htmlFor="form-type" className="block text-sm font-medium text-gray-700 mb-2">
          Select Form Type
        </Label>
        <Select value={formType} onValueChange={(value: 'metric' | 'workout') => setFormType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a form type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Progress Metric</SelectItem>
            <SelectItem value="workout">Workout Log</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formType === 'metric' ? (
        <form onSubmit={metricForm.handleSubmit(handleMetricSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="metricDate">Date</Label>
            <Input
              id="metricDate"
              type="date"
              {...metricForm.register('date')}
              className="mt-1 block w-full"
            />
            {metricForm.formState.errors.date && (
              <p className="text-red-500 text-sm mt-1">{metricForm.formState.errors.date.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="metricName">Metric Name</Label>
            <Input
              id="metricName"
              type="text"
              {...metricForm.register('metricName')}
              placeholder="e.g., Weight, Bench Press Max"
              className="mt-1 block w-full"
            />
            {metricForm.formState.errors.metricName && (
              <p className="text-red-500 text-sm mt-1">{metricForm.formState.errors.metricName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="metricValue">Metric Value</Label>
            <Input
              id="metricValue"
              type="number"
              step="0.1"
              {...metricForm.register('metricValue')}
              placeholder="e.g., 70 (kg), 100 (lbs)"
              className="mt-1 block w-full"
            />
            {metricForm.formState.errors.metricValue && (
              <p className="text-red-500 text-sm mt-1">{metricForm.formState.errors.metricValue.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            {isLoading ? 'Logging...' : 'Log Metric'}
          </Button>
        </form>
      ) : (
        <form onSubmit={workoutForm.handleSubmit(handleWorkoutSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="workoutDate">Date</Label>
            <Input
              id="workoutDate"
              type="date"
              {...workoutForm.register('date')}
              className="mt-1 block w-full"
            />
            {workoutForm.formState.errors.date && (
              <p className="text-red-500 text-sm mt-1">{workoutForm.formState.errors.date.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              {...workoutForm.register('description')}
              placeholder="e.g., Full Body Workout"
              className="mt-1 block w-full"
            />
            {workoutForm.formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">{workoutForm.formState.errors.description.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="exercises">Exercises</Label>
            <Textarea
              id="exercises"
              {...workoutForm.register('exercises')}
              placeholder="e.g., Bench Press 3x10, Squats 3x10"
              className="mt-1 block w-full"
            />
            {workoutForm.formState.errors.exercises && (
              <p className="text-red-500 text-sm mt-1">{workoutForm.formState.errors.exercises.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            {isLoading ? 'Logging...' : 'Log Workout'}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ProgressTrackerForm;