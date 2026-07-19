import React from 'react';
import Layout from '@/components/Layout';
import { useBookings } from '@/hooks/useBookings';
import { ClassSchedule } from '@/components/booking/ClassSchedule';

const ClassesPage: React.FC = () => {
  const { fitnessClasses, userBookings, isLoadingClasses, isLoadingBookings, errorClasses, errorBookings, bookClass, cancelUserBooking, isBookingLoading, isCancelLoading } = useBookings();

  return (
    <Layout>
      <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Vikram's Fitness Studio</h1>
          <p className="mt-4 text-xl md:text-2xl font-light">Find your perfect workout and book your spot today!</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0D1B2A] text-center mb-8">Our Class Schedule</h2>
          {isLoadingClasses || isLoadingBookings ? (
            <p className="text-center text-[#333333]">Loading classes...</p>
          ) : errorClasses || errorBookings ? (
            <p className="text-center text-red-500">Error loading classes: {errorClasses?.message || errorBookings?.message}</p>
          ) : (
            <ClassSchedule
              fitnessClasses={fitnessClasses}
              userBookings={userBookings}
              onBookClass={bookClass}
              onCancelBooking={cancelUserBooking}
              isLoading={isLoadingClasses || isLoadingBookings}
              isBookingLoading={isBookingLoading}
              isCancelLoading={isCancelLoading}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ClassesPage;