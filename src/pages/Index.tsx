
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import GuestTable from '@/components/GuestTable';
import GuestForm from '@/components/GuestForm';
import { Guest, GuestFilter, guestDb } from '@/lib/db';
import { toast } from "sonner";

const Index: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filter, setFilter] = useState<GuestFilter>({
    sortBy: 'name',
    sortDirection: 'asc',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadGuests = async () => {
    try {
      await guestDb.init();
      const loadedGuests = await guestDb.getAllGuests(filter);
      setGuests(loadedGuests);
    } catch (error) {
      console.error('Error loading guests:', error);
      toast.error("Failed to load guest data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadGuests();
  }, [filter]);
  
  const handleAddGuest = () => {
    setEditingGuestId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditGuest = (id: string) => {
    setEditingGuestId(id);
    setIsFormOpen(true);
  };
  
  const handleDeleteGuest = async (id: string) => {
    try {
      await guestDb.deleteGuest(id);
      await loadGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Failed to delete guest");
    }
  };
  
  const handleExport = async () => {
    try {
      const csvContent = await guestDb.exportToCSV();
      
      // Create a blob and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `safecheckinn-guests-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Guest data exported successfully");
    } catch (error) {
      console.error('Error exporting guests:', error);
      toast.error("Failed to export guest data");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container-xl py-6">
        <FilterBar
          onFilterChange={setFilter}
          onAddGuest={handleAddGuest}
          onExport={handleExport}
        />
        
        <div className="bg-white border rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading guest data...
            </div>
          ) : (
            <GuestTable
              guests={guests}
              onEditGuest={handleEditGuest}
              onDeleteGuest={handleDeleteGuest}
            />
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-right">
          {guests.length} guests
        </div>
      </main>
      
      <GuestForm
        guestId={editingGuestId}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={loadGuests}
      />
    </div>
  );
};

export default Index;
