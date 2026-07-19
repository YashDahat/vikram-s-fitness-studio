import { Layout } from '@/components/Layout';
import { UpcomingBookings } from '@/components/member/UpcomingBookings';
import { MembershipStatus } from '@/components/member/MembershipStatus';
import ProgressChart from '@/components/member/ProgressChart';
import { useAuth } from '@/hooks/useAuth';

const MemberDashboardPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
            Welcome, {user?.username ?? 'Member'}!
          </h1>
          <p className="text-lg text-gray-700 mb-12 leading-relaxed">
            Your fitness journey starts here. Track your progress, manage your bookings, and stay motivated.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <UpcomingBookings />
            <MembershipStatus />
          </div>

          <div className="mb-16">
            <ProgressChart />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MemberDashboardPage;