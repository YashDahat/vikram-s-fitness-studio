import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resourceName: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  resourceName,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md">
          <AlertDialogTitle className="text-xl font-semibold mb-4">Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 mb-6">
            Are you sure you want to delete this {resourceName}? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end space-x-3">
            <AlertDialogCancel
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-[#F26419] hover:bg-[#F26419] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}