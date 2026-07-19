import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import Layout from '@/components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <section className="py-16 px-4 bg-white min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-[#F26419] mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">Page Not Found</h2>
          <p className="text-lg text-[#333333] leading-relaxed mb-8">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to={ROUTES.HOME}
            className="bg-[#F26419] hover:bg-[#E05A16] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
          >
            Go to Homepage
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;