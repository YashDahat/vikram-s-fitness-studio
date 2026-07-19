import { useState, useEffect } from 'react';
import { getMembershipPlans } from '@/services/membershipService';
import type { MembershipPlanDto } from '@/types/membership';

export const useMemberships = () => {
  const [memberships, setMemberships] = useState<MembershipPlanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setIsLoading(true);
        const data = await getMembershipPlans();
        setMemberships(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  return { memberships, isLoading, error };
};