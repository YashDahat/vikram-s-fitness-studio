import { useState } from 'react';
import { FitnessClassDto } from '@/types/fitness';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { ClassForm } from './ClassForm';
import { DeleteConfirmationDialog } from '../../DeleteConfirmationDialog';
import { useClasses } from '@/hooks/useClasses';

interface ClassesTableProps {
  classes: FitnessClassDto[];
}

export const ClassesTable = ({ classes }: ClassesTableProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<FitnessClassDto | null>(null);
  const { deleteFitnessClassMutation } = useClasses();

  const handleEdit = (fitnessClass: FitnessClassDto) => {
    setSelectedClass(fitnessClass);
    setIsFormOpen(true);
  };

  const handleDelete = (fitnessClass: FitnessClassDto) => {
    setSelectedClass(fitnessClass);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClass?.id) {
      await deleteFitnessClassMutation.mutateAsync(selectedClass.id);
      setIsDeleteDialogOpen(false);
      setSelectedClass(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Booked Slots</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((fitnessClass) => (
            <TableRow key={fitnessClass.id}>
              <TableCell className="font-medium">{fitnessClass.name}</TableCell>
              <TableCell>{fitnessClass.description}</TableCell>
              <TableCell>{fitnessClass.startTime}</TableCell>
              <TableCell>{fitnessClass.endTime}</TableCell>
              <TableCell>{fitnessClass.instructor}</TableCell>
              <TableCell>{fitnessClass.maxCapacity}</TableCell>
              <TableCell>{fitnessClass.currentBookedSlots}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" className="text-[#1B998B] hover:text-[#1B998B]" onClick={() => handleEdit(fitnessClass)}>
                  Edit
                </Button>
                <Button variant="ghost" className="text-[#F26419] hover:text-[#F26419]" onClick={() => handleDelete(fitnessClass)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <ClassForm
          fitnessClass={selectedClass}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedClass(null);
          }}
        />
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        resourceName="fitness class"
      />
    </div>
  );
};