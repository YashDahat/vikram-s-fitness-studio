import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { useBookings } from '@/hooks/useBookings';
import type { FitnessClassDto } from '@/types/fitness';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFitnessClass, updateFitnessClass } from '@/services/classService';

const classFormSchema = z.object({
  id: z.number().optional().nullable(),
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional().nullable(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  instructor: z.string().min(1, 'Instructor name is required'),
  maxCapacity: z.coerce.number().min(1, 'Max capacity must be at least 1'),
  currentBookedSlots: z.coerce.number().optional().nullable(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  classToEdit?: FitnessClassDto;
}

export const ClassForm = ({ isOpen, onClose, classToEdit }: ClassFormProps) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      id: undefined,
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      instructor: '',
      maxCapacity: 1,
      currentBookedSlots: 0,
    },
  });

  useEffect(() => {
    if (classToEdit) {
      reset({
        ...classToEdit,
        startTime: classToEdit.startTime?.substring(0, 16) ?? '', // Format for datetime-local input
        endTime: classToEdit.endTime?.substring(0, 16) ?? '', // Format for datetime-local input
      });
    } else {
      reset({
        id: undefined,
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        instructor: '',
        maxCapacity: 1,
        currentBookedSlots: 0,
      });
    }
  }, [classToEdit, reset]);

  const createClassMutation = useMutation({
    mutationFn: createFitnessClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFitnessClasses'] });
      onClose();
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, ...data }: FitnessClassDto) => updateFitnessClass(id as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFitnessClasses'] });
      onClose();
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    const classDto: FitnessClassDto = {
      ...data,
      id: data.id ?? null,
      description: data.description ?? null,
      currentBookedSlots: data.currentBookedSlots ?? 0,
    };

    if (classToEdit?.id) {
      await updateClassMutation.mutateAsync(classDto);
    } else {
      await createClassMutation.mutateAsync(classDto);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              {classToEdit ? 'Edit Fitness Class' : 'Create Fitness Class'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {classToEdit
                ? 'Update the details of the fitness class.'
                : 'Fill in the details to create a new fitness class.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Class Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                {...register('startTime')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                {...register('endTime')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                Instructor
              </Label>
              <Input
                id="instructor"
                type="text"
                {...register('instructor')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.instructor && (
                <p className="text-red-500 text-xs mt-1">{errors.instructor.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                Max Capacity
              </Label>
              <Input
                id="maxCapacity"
                type="number"
                {...register('maxCapacity')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.maxCapacity && (
                <p className="text-red-500 text-xs mt-1">{errors.maxCapacity.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md px-4 py-2 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
                disabled={createClassMutation.isPending || updateClassMutation.isPending}
              >
                {createClassMutation.isPending || updateClassMutation.isPending
                  ? 'Saving...'
                  : classToEdit
                    ? 'Update Class'
                    : 'Create Class'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};