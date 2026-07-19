import { useBookings } from '@/hooks/useBookings';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export const UpcomingBookings = () => {
  const { userBookings, fitnessClasses, isLoadingBookings, isLoadingClasses, errorBookings, errorClasses } = useBookings();

  if (isLoadingBookings || isLoadingClasses) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  if (errorBookings || errorClasses) {
    return (
      <Card className="p-6 text-red-500">
        <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
        <p>Error loading bookings: {errorBookings?.message || errorClasses?.message}</p>
      </Card>
    );
  }

  const upcomingBookings = userBookings
    .map(booking => {
      const fitnessClass = fitnessClasses.find(fc => fc.id === booking.fitnessClassId);
      return fitnessClass ? { ...booking, fitnessClass } : null;
    })
    .filter(Boolean)
    .filter(booking => new Date(booking!.fitnessClass!.startTime ?? '') > new Date())
    .sort((a, b) => new Date(a!.fitnessClass!.startTime ?? '').getTime() - new Date(b!.fitnessClass!.startTime ?? '').getTime())
    .slice(0, 3); // Show next 3 upcoming bookings

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
      {upcomingBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <CalendarIcon className="h-12 w-12 mb-4" />
          <p className="text-lg">No upcoming bookings.</p>
          <p className="text-sm">Book a class to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingBookings.map(booking => (
            <div key={booking!.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <p className="font-semibold text-lg">{booking!.fitnessClass!.name}</p>
              <p className="text-gray-600">Instructor: {booking!.fitnessClass!.instructor}</p>
              <p className="text-gray-600">
                {format(new Date(booking!.fitnessClass!.startTime ?? ''), 'PPP p')}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};