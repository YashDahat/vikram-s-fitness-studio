import { BookingDto } from '@/types/booking';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface BookingsTableProps {
  bookings: BookingDto[];
  onCancelBooking: (bookingId: number) => Promise<void>;
  isLoading: boolean;
}

export function BookingsTable({ bookings, onCancelBooking, isLoading }: BookingsTableProps) {
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  const handleCancel = async (bookingId: number) => {
    setIsCancelling(bookingId);
    try {
      await onCancelBooking(bookingId);
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B998B]" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Class ID</TableHead>
            <TableHead>Booking Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.id}</TableCell>
              <TableCell>{booking.fitnessClassId}</TableCell>
              <TableCell>{booking.bookingTime ? new Date(booking.bookingTime).toLocaleString() : 'N/A'}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell className="text-right">
                {booking.status === 'CONFIRMED' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="transition-all duration-200">
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently cancel your booking.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline" className="transition-all duration-200">
                            No, keep booking
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="destructive"
                            onClick={() => booking.id && handleCancel(booking.id)}
                            disabled={isCancelling === booking.id}
                            className="transition-all duration-200"
                          >
                            {isCancelling === booking.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              'Yes, cancel booking'
                            )}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}