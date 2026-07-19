import React from 'react';
import { FitnessClassDto, BookingDto } from '@/types/fitness'; // Corrected import path for FitnessClassDto
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ClassScheduleProps {
  fitnessClasses: FitnessClassDto[];
  userBookings: BookingDto[];
  onBookClass: (fitnessClassId: number) => void;
  onCancelBooking: (bookingId: number) => void;
  isLoading: boolean;
  isBookingLoading: boolean;
  isCancelLoading: boolean;
}

export const ClassSchedule: React.FC<ClassScheduleProps> = ({
  fitnessClasses,
  userBookings,
  onBookClass,
  onCancelBooking,
  isLoading,
  isBookingLoading,
  isCancelLoading,
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return <div className="text-center py-8 text-[#333333]">Loading class schedule...</div>;
  }

  if (!fitnessClasses || fitnessClasses.length === 0) {
    return <div className="text-center py-8 text-[#333333]">No fitness classes available at the moment.</div>;
  }

  const groupedClasses = fitnessClasses.reduce((acc, classItem) => {
    const date = classItem.startTime ? format(parseISO(classItem.startTime), 'EEEE, MMMM d, yyyy') : 'Unknown Date';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(classItem);
    return acc;
  }, {} as Record<string, FitnessClassDto[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedClasses).map(([date, classes]) => (
        <div key={date} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-2xl font-semibold text-[#0D1B2A] mb-6">{date}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes
              .sort((a, b) => {
                if (!a.startTime || !b.startTime) return 0;
                return parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime();
              })
              .map((classItem) => {
                const isFull = (classItem.currentBookedSlots ?? 0) >= (classItem.maxCapacity ?? 0);
                const userBooking = userBookings.find(
                  (booking) =>
                    booking.fitnessClassId === classItem.id &&
                    booking.status !== 'CANCELLED'
                );
                const isBookedByUser = !!userBooking;

                return (
                  <div key={classItem.id} className="card p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-[#1B998B] mb-2">{classItem.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Instructor:</span> {classItem.instructor ?? 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Time:</span>{' '}
                        {classItem.startTime && classItem.endTime
                          ? `${format(parseISO(classItem.startTime), 'h:mm a')} - ${format(parseISO(classItem.endTime), 'h:mm a')}`
                          : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Slots:</span> {classItem.currentBookedSlots ?? 0} / {classItem.maxCapacity ?? 0}
                        {isFull && <span className="ml-2 text-red-500 font-semibold">Full</span>}
                      </p>
                      <p className="text-sm text-gray-700 mb-4">{classItem.description ?? 'No description available.'}</p>
                    </div>
                    {user && (
                      <div className="mt-auto">
                        {isBookedByUser ? (
                          <Button
                            onClick={() => userBooking?.id && onCancelBooking(userBooking.id)}
                            disabled={isCancelLoading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-4 py-2 transition-all duration-200"
                          >
                            {isCancelLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Cancel Booking'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => classItem.id && onBookClass(classItem.id)}
                            disabled={isFull || isBookingLoading}
                            className="w-full bg-[#1B998B] hover:bg-[#157a6e] text-white font-semibold rounded-full px-4 py-2 transition-all duration-200"
                          >
                            {isBookingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Book Now'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};