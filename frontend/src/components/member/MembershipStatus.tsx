import { Card } from '@/components/ui/card';
import { useMemberships } from '@/hooks/useMemberships';
import { UserMembershipDto } from '@/types/membership';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const MembershipStatus = () => {
  const { userMemberships, isLoading, error } = useMemberships();

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1B998B]" />
        <p className="mt-4 text-gray-600">Loading membership status...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center text-red-600">
        <p>Error loading membership status: {error.message}</p>
      </Card>
    );
  }

  const currentMembership: UserMembershipDto | undefined = userMemberships?.[0]; // Assuming the first one is the current/most recent

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-[#333333] mb-4">Membership Status</h3>
      {currentMembership ? (
        <div>
          <p className="text-lg font-medium text-[#1B998B]">{currentMembership.membershipPlanName ?? 'N/A'}</p>
          <p className="text-gray-600 mt-2">
            Status: <span className={`font-semibold ${currentMembership.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{currentMembership.status ?? 'N/A'}</span>
          </p>
          <p className="text-gray-600">
            Start Date: {currentMembership.startDate ? format(new Date(currentMembership.startDate), 'PPP') : 'N/A'}
          </p>
          <p className="text-gray-600">
            End Date: {currentMembership.endDate ? format(new Date(currentMembership.endDate), 'PPP') : 'N/A'}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">No active membership found.</p>
      )}
    </Card>
  );
};