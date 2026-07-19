import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@radix-ui/react-label';
import { DialogClose } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@radix-ui/react-checkbox';
import {
  createMembershipPlan,
  updateMembershipPlan,
} from '@/services/membershipService';
import type { MembershipPlanDto } from '@/types/membership';
import { useState, useEffect } from 'react';

interface MembershipPlanFormProps {
  plan?: MembershipPlanDto;
  onSuccess: () => void;
  onClose: () => void;
}

const membershipPlanSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  durationInMonths: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  isActive: z.boolean(),
});

type MembershipPlanFormData = z.infer<typeof membershipPlanSchema>;

export const MembershipPlanForm = ({
  plan,
  onSuccess,
  onClose,
}: MembershipPlanFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MembershipPlanFormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      id: plan?.id ?? undefined,
      name: plan?.name ?? '',
      description: plan?.description ?? '',
      price: plan?.price ?? 0,
      durationInMonths: plan?.durationInMonths ?? 0,
      isActive: plan?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (plan) {
      reset({
        id: plan.id ?? undefined,
        name: plan.name ?? '',
        description: plan.description ?? '',
        price: plan.price ?? 0,
        durationInMonths: plan.durationInMonths ?? 0,
        isActive: plan.isActive ?? true,
      });
    } else {
      reset({
        id: undefined,
        name: '',
        description: '',
        price: 0,
        durationInMonths: 0,
        isActive: true,
      });
    }
  }, [plan, reset]);

  const onSubmit = async (data: MembershipPlanFormData) => {
    try {
      if (plan?.id) {
        await updateMembershipPlan(plan.id, data as MembershipPlanDto);
      } else {
        await createMembershipPlan(data as MembershipPlanDto);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save membership plan:', error);
      // TODO: Add error notification
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register('description')} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" {...register('price')} />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="durationInMonths">Duration (in months)</Label>
        <Input
          id="durationInMonths"
          type="number"
          {...register('durationInMonths')}
        />
        {errors.durationInMonths && (
          <p className="text-red-500 text-sm">
            {errors.durationInMonths.message}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={useForm().watch('isActive')}
          onCheckedChange={(checked) => useForm().setValue('isActive', checked as boolean)}
          className="w-4 h-4 rounded border border-gray-300 focus:ring-2 focus:ring-[#1B998B] data-[state=checked]:bg-[#1B998B] data-[state=checked]:text-white"
        />
        <Label htmlFor="isActive">Is Active</Label>
        {errors.isActive && (
          <p className="text-red-500 text-sm">{errors.isActive.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting} className="bg-[#1B998B] hover:bg-[#1B998B] text-white">
          {plan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
};