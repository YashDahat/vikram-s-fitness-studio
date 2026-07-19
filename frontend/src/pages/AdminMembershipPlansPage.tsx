import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { MembershipPlansTable } from '@/components/admin/membership/MembershipPlansTable';
import { MembershipPlanForm } from '@/components/admin/membership/MembershipPlanForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMemberships } from '@/hooks/useMemberships';
import type { MembershipPlanDto } from '@/types/membership';
import { deleteMembershipPlan } from '@/services/membershipService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { Separator } from '@/components/ui/separator';

export default function AdminMembershipPlansPage() {
  const { memberships, isLoading, error } = useMemberships();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlanDto | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDeleteId, setPlanToDeleteId] = useState<string | null>(null);

  const handleCreateNewPlan = () => {
    setSelectedPlan(undefined);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: MembershipPlanDto) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };

  const handleDeletePlan = (planId: string) => {
    setPlanToDeleteId(planId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDeleteId) {
      try {
        await deleteMembershipPlan(planToDeleteId);
        // TODO: Refresh memberships after deletion
        console.log('Membership plan deleted successfully');
      } catch (error) {
        console.error('Failed to delete membership plan:', error);
      } finally {
        setIsDeleteDialogOpen(false);
        setPlanToDeleteId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading membership plans...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full text-red-500">
          <p>Error loading membership plans: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Membership Plans</h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200" onClick={handleCreateNewPlan}>
                  <PlusCircleIcon className="mr-2 h-5 w-5" />
                  Add New Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle>{selectedPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}</DialogTitle>
                </DialogHeader>
                <MembershipPlanForm
                  plan={selectedPlan}
                  onSuccess={() => {
                    setIsFormOpen(false);
                    // TODO: Refresh memberships after success
                  }}
                  onClose={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="mb-6" />
          <MembershipPlansTable
            plans={memberships}
            onEdit={handleEditPlan}
            onDelete={handleDeletePlan}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this membership plan? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </AdminLayout>
  );
}