import { MembershipPlanDto } from '@/types/membership';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface MembershipPlanCardProps {
  plan: MembershipPlanDto;
}

const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({ plan }) => {
  const { createOrder, isCreatingOrder } = useOrders();

  const handleJoinNow = async () => {
    if (plan.id) {
      await createOrder(plan.id);
    }
  };

  return (
    <Card className="flex flex-col p-6 rounded-xl shadow-md border border-gray-100 bg-white transition-all duration-200 hover:shadow-lg">
      <h3 className="text-2xl font-semibold text-[#333333] mb-3">{plan.name}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{plan.description}</p>
      <div className="flex items-baseline mb-4">
        <span className="text-4xl font-bold text-[#F26419]">${plan.price ?? 0}</span>
        <span className="text-xl text-gray-600">/{plan.durationInMonths ?? 1} months</span>
      </div>
      <Button
        onClick={handleJoinNow}
        className="bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Join Now'
        )}
      </Button>
    </Card>
  );
};

export default MembershipPlanCard;