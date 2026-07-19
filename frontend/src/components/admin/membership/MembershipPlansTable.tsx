import { MembershipPlanDto } from '@/types/membership';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';

interface MembershipPlansTableProps {
  plans: MembershipPlanDto[];
  onEdit: (plan: MembershipPlanDto) => void;
  onDelete: (planId: string) => void;
}

export function MembershipPlansTable({ plans, onEdit, onDelete }: MembershipPlansTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration (Months)</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No membership plans found.
              </TableCell>
            </TableRow>
          ) : (
            plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>${plan.price?.toFixed(2)}</TableCell>
                <TableCell>{plan.durationInMonths}</TableCell>
                <TableCell>{plan.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(plan)}
                    className="mr-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <PencilIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => plan.id && onDelete(plan.id)}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}