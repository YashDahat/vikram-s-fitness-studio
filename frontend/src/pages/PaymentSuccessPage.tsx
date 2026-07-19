import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ROUTES } from '@/routes';

const PaymentSuccessPage = () => {
  return (
    <Layout>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <svg
            className="mx-auto h-24 w-24 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-6">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mt-4 leading-relaxed">
            Thank you for becoming a member of Vikram's Fitness Studio. Your journey to a healthier you begins now!
          </p>
          <div className="mt-8">
            <Link
              to={ROUTES.MEMBER_DASHBOARD}
              className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
            >
              Go to Member Dashboard
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentSuccessPage;