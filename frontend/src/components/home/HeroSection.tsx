import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline, subheadline, ctaText }) => {
  return (
    <section
      className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{headline}</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{subheadline}</p>
        <Link
          to={ROUTES.CLASSES}
          className="bg-[#F26419] hover:bg-[#E05A16] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;