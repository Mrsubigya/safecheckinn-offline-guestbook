
import React from 'react';
import { Guest } from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GuestTableProps {
  guests: Guest[];
  onEditGuest: (id: string) => void;
  onDeleteGuest: (id: string) => void;
}

const GuestTable: React.FC<GuestTableProps> = ({ 
  guests, 
  onEditGuest, 
  onDeleteGuest 
}) => {
  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [showIDDialog, setShowIDDialog] = React.useState(false);
  
  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteGuest(deleteConfirm);
      setDeleteConfirm(null);
    }
  };
  
  const handleShowID = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowIDDialog(true);
  };
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="excel-table">
          <thead className="excel-header">
            <tr>
              <th>Guest Name</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Room</th>
              <th>Contact</th>
              <th>Purpose of Visit</th>
              <th>ID Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan={8} className="excel-cell text-center py-8 text-gray-500">
                  No guests found. Add a new guest to get started.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="excel-row">
                  <td className="excel-cell font-medium">{guest.name}</td>
                  <td className="excel-cell">{format(new Date(guest.checkIn), "MMM dd, yyyy")}</td>
                  <td className="excel-cell">{format(new Date(guest.checkOut), "MMM dd, yyyy")}</td>
                  <td className="excel-cell">{guest.roomNumber || "-"}</td>
                  <td className="excel-cell">{guest.contactNumber || "-"}</td>
                  <td className="excel-cell">{guest.purposeOfVisit || "-"}</td>
                  <td className="excel-cell">
                    {(guest.idFrontImage || guest.idBackImage) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShowID(guest)}
                      >
                        View ID
                      </Button>
                    ) : (
                      "Not uploaded"
                    )}
                  </td>
                  <td className="excel-cell">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditGuest(guest.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(guest.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this guest? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* ID Document Viewer Dialog */}
      <Dialog open={showIDDialog} onOpenChange={setShowIDDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>ID Documents - {selectedGuest?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {selectedGuest?.idFrontImage && (
              <div className="space-y-2">
                <h3 className="font-medium">Front of ID</h3>
                <div className="border rounded-lg p-2">
                  <img 
                    src={selectedGuest.idFrontImage} 
                    alt="Front ID" 
                    className="max-h-72 mx-auto object-contain" 
                  />
                </div>
              </div>
            )}
            
            {selectedGuest?.idBackImage && (
              <div className="space-y-2">
                <h3 className="font-medium">Back of ID</h3>
                <div className="border rounded-lg p-2">
                  <img 
                    src={selectedGuest.idBackImage} 
                    alt="Back ID" 
                    className="max-h-72 mx-auto object-contain" 
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestTable;
