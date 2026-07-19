import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

const CtaSection = () => {
  return (
    <section className="bg-[#F5F5F5] py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
          Ready to Transform Your Life?
        </h2>
        <p className="text-[#333333] leading-relaxed mb-8 max-w-2xl mx-auto">
          Join Vikram's Fitness Studio today and embark on a journey towards a healthier, stronger, and happier you. Our expert trainers and supportive community are here to guide you every step of the way.
        </p>
        <Link
          to={ROUTES.MEMBERSHIP}
          className="bg-[#F26419] hover:bg-[#E05A16] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        >
          Join Our Community
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;