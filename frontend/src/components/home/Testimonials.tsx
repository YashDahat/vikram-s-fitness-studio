import React from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

const Testimonials: React.FC = () => {
  const { reviews, isLoading, error } = useReviews();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-8">What Our Members Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="p-6 flex flex-col items-center text-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-300 mb-4"></div>
                <div className="h-4 bg-gray-300 w-3/4 mb-2"></div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300 fill-gray-300" />
                  ))}
                </div>
                <div className="h-4 bg-gray-300 w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-300 w-full"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-8">What Our Members Say</h2>
          <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-8">What Our Members Say</h2>
          <p className="text-[#333333]">No testimonials available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-8">What Our Members Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review, index) => (
            <Card key={index} className="p-6 flex flex-col items-center text-center">
              {review.profilePhotoUrl && (
                <img
                  src={review.profilePhotoUrl}
                  alt={review.authorName ?? 'Reviewer'}
                  className="w-16 h-16 rounded-full object-cover mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-[#333333] mb-2">{review.authorName}</h3>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'h-5 w-5',
                      i < (review.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4">{review.relativePublishTime}</p>
              <p className="text-[#333333] leading-relaxed italic">"{review.text}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;