import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useMemberships } from '@/hooks/useMemberships';
import MembershipPlanCard from '@/components/membership/MembershipPlanCard';
import { Loader2 } from 'lucide-react';
import { ROUTES } from '@/routes';

const MembershipPage: React.FC = () => {
  const { memberships, isLoading, error } = useMemberships();

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlock Your Potential with Vikram's Fitness Studio Memberships</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Invest in your long-term health and achieve sustainable results with our personalized plans.
          </p>
          <Link
            to={ROUTES.CLASSES}
            className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            View Our Classes
          </Link>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#333333] mb-12">Our Membership Plans</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-[#F26419]" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg">
              Error loading membership plans: {error.message}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {memberships.map((plan) => (
                <MembershipPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPage;