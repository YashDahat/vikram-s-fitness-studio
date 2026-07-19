import { useQuery } from '@tanstack/react-query';
import { getGoogleReviews } from '@/services/reviewService';

export const useReviews = () => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['googleReviews'],
    queryFn: getGoogleReviews,
  });

  return {
    reviews: reviews ?? [],
    isLoading,
    error,
  };
};