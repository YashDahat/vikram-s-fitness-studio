import { Layout } from '@/components/Layout';
import { BookingsTable } from '@/components/member/BookingsTable';
import { useBookings } from '@/hooks/useBookings';
import { Loader2 } from 'lucide-react';

export default function MyBookingsPage() {
  const { userBookings, isLoadingBookings, cancelUserBooking, isCancelLoading, errorBookings } = useBookings();

  if (isLoadingBookings) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#1B998B] mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Loading your bookings...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (errorBookings) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-red-600">Error</h2>
            <p className="mt-4 text-lg text-gray-600">Failed to load bookings: {errorBookings.message}</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#333333]">My Bookings</h1>
          <BookingsTable bookings={userBookings} onCancelBooking={cancelUserBooking} isLoading={isCancelLoading} />
        </div>
      </section>
    </Layout>
  );
}