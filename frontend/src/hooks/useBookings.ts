import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllFitnessClasses,
  getUserBookings,
  createBooking,
  cancelBooking,
} from '@/services/bookingService';
import type { FitnessClassDto, BookingDto } from '@/types/booking';

export const useBookings = () => {
  const queryClient = useQueryClient();

  const {
    data: fitnessClasses,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = useQuery<FitnessClassDto[]>({
    queryKey: ['fitnessClasses'],
    queryFn: getAllFitnessClasses,
  });

  const {
    data: userBookings,
    isLoading: isLoadingBookings,
    error: errorBookings,
  } = useQuery<BookingDto[]>({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
  });

  const bookClassMutation = useMutation({
    mutationFn: (fitnessClassId: number) => createBooking({ fitnessClassId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['fitnessClasses'] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      queryClient.invalidateQueries({ queryKey: ['fitnessClasses'] });
    },
  });

  const bookClass = async (fitnessClassId: number) => {
    await bookClassMutation.mutateAsync(fitnessClassId);
  };

  const cancelUserBooking = async (bookingId: number) => {
    await cancelBookingMutation.mutateAsync(bookingId);
  };

  return {
    fitnessClasses: fitnessClasses ?? [],
    userBookings: userBookings ?? [],
    isLoadingClasses,
    isLoadingBookings,
    errorClasses,
    errorBookings,
    bookClass,
    cancelUserBooking,
    isBookingLoading: bookClassMutation.isPending,
    isCancelLoading: cancelBookingMutation.isPending,
  };
};