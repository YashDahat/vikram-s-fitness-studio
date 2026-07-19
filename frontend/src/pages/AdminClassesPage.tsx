import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { ClassesTable } from '@/components/admin/classes/ClassesTable';
import { ClassForm } from '@/components/admin/classes/ClassForm';
import { useClasses } from '@/hooks/useClasses';
import { Dialog } from '@radix-ui/react-dialog';
import { FitnessClassDto } from '@/types/fitness';
import { Loader2 } from 'lucide-react';

const AdminClassesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClassDto | undefined>(undefined);
  const { adminFitnessClasses, isLoadingClasses, errorClasses } = useClasses();

  const handleCreateNewClass = () => {
    setSelectedClass(undefined);
    setIsFormOpen(true);
  };

  if (isLoadingClasses) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-12 w-12 animate-spin text-[#1B998B]" />
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (errorClasses) {
    return (
      <AdminLayout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-red-500">Error loading fitness classes: {errorClasses.message}</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Fitness Classes</h1>

          <div className="flex justify-end mb-4">
            <Button
              onClick={handleCreateNewClass}
              className="bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
            >
              Add New Class
            </Button>
          </div>

          {adminFitnessClasses.length > 0 ? (
            <ClassesTable classes={adminFitnessClasses} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-gray-600">No fitness classes found. Add a new class to get started.</p>
            </div>
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ClassForm
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedClass(undefined);
              }}
              classToEdit={selectedClass}
            />
          </Dialog>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminClassesPage;