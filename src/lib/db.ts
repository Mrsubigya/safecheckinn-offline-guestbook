
import { toast } from "sonner";

export interface Guest {
  id: string;
  name: string;
  checkIn: Date;
  checkOut: Date;
  roomNumber?: string;
  contactNumber?: string;
  purposeOfVisit?: string;
  idFrontImage?: string;
  idBackImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestFilter {
  searchText?: string;
  sortBy?: keyof Guest;
  sortDirection?: 'asc' | 'desc';
}

const DB_NAME = 'safecheckinn-db';
const STORE_NAME = 'guests';
const DB_VERSION = 1;

class GuestDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Database error:', request.error);
        toast.error("Failed to open database. Please refresh and try again.");
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Create indexes for faster querying
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('checkIn', 'checkIn', { unique: false });
          store.createIndex('checkOut', 'checkOut', { unique: false });
          store.createIndex('roomNumber', 'roomNumber', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = request.result;
        console.log('Database initialized successfully');
        resolve();
      };
    });
  }

  async addGuest(guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const now = new Date();
        const newGuest: Guest = {
          ...guest,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
          checkIn: new Date(guest.checkIn),
          checkOut: new Date(guest.checkOut),
        };
        
        const request = store.add(newGuest);
        
        request.onsuccess = () => {
          resolve(newGuest);
          toast.success("Guest added successfully");
        };
        
        request.onerror = () => {
          console.error('Error adding guest:', request.error);
          toast.error("Failed to add guest");
          reject(request.error);
        };
      } catch (error) {
        console.error('Error in addGuest:', error);
        toast.error("An unexpected error occurred");
        reject(error);
      }
    });
  }

  async updateGuest(guest: Partial<Guest> & { id: string }): Promise<Guest> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const getRequest = store.get(guest.id);
        
        getRequest.onsuccess = () => {
          const existingGuest = getRequest.result;
          
          if (!existingGuest) {
            reject(new Error('Guest not found'));
            toast.error("Guest not found");
            return;
          }
          
          const updatedGuest: Guest = {
            ...existingGuest,
            ...guest,
            updatedAt: new Date(),
            checkIn: guest.checkIn ? new Date(guest.checkIn) : existingGuest.checkIn,
            checkOut: guest.checkOut ? new Date(guest.checkOut) : existingGuest.checkOut,
          };
          
          const updateRequest = store.put(updatedGuest);
          
          updateRequest.onsuccess = () => {
            resolve(updatedGuest);
            toast.success("Guest updated successfully");
          };
          
          updateRequest.onerror = () => {
            console.error('Error updating guest:', updateRequest.error);
            toast.error("Failed to update guest");
            reject(updateRequest.error);
          };
        };
        
        getRequest.onerror = () => {
          console.error('Error getting guest:', getRequest.error);
          toast.error("Failed to retrieve guest details");
          reject(getRequest.error);
        };
      } catch (error) {
        console.error('Error in updateGuest:', error);
        toast.error("An unexpected error occurred");
        reject(error);
      }
    });
  }

  async deleteGuest(id: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.delete(id);
        
        request.onsuccess = () => {
          resolve();
          toast.success("Guest deleted successfully");
        };
        
        request.onerror = () => {
          console.error('Error deleting guest:', request.error);
          toast.error("Failed to delete guest");
          reject(request.error);
        };
      } catch (error) {
        console.error('Error in deleteGuest:', error);
        toast.error("An unexpected error occurred");
        reject(error);
      }
    });
  }

  async getGuest(id: string): Promise<Guest | null> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        
        request.onerror = () => {
          console.error('Error getting guest:', request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error('Error in getGuest:', error);
        reject(error);
      }
    });
  }

  async getAllGuests(filter?: GuestFilter): Promise<Guest[]> {
    if (!this.db) {
      await this.init();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.getAll();
        
        request.onsuccess = () => {
          let guests = request.result;
          
          // Apply filtering and sorting
          if (filter) {
            if (filter.searchText) {
              const searchLower = filter.searchText.toLowerCase();
              guests = guests.filter(guest => 
                guest.name.toLowerCase().includes(searchLower) ||
                guest.roomNumber?.toLowerCase().includes(searchLower) ||
                guest.purposeOfVisit?.toLowerCase().includes(searchLower)
              );
            }
            
            if (filter.sortBy) {
              guests.sort((a, b) => {
                const valueA = a[filter.sortBy!];
                const valueB = b[filter.sortBy!];
                
                if (valueA < valueB) return filter.sortDirection === 'asc' ? -1 : 1;
                if (valueA > valueB) return filter.sortDirection === 'asc' ? 1 : -1;
                return 0;
              });
            }
          }
          
          resolve(guests);
        };
        
        request.onerror = () => {
          console.error('Error getting all guests:', request.error);
          reject(request.error);
        };
      } catch (error) {
        console.error('Error in getAllGuests:', error);
        reject(error);
      }
    });
  }

  async exportToCSV(): Promise<string> {
    try {
      const guests = await this.getAllGuests();
      
      const headers = ["Name", "Check-in Date", "Check-out Date", "Room Number", 
                      "Contact Number", "Purpose of Visit", "Created At", "Updated At"];
      
      const rows = guests.map(guest => [
        guest.name,
        guest.checkIn.toLocaleDateString(),
        guest.checkOut.toLocaleDateString(),
        guest.roomNumber || "",
        guest.contactNumber || "",
        guest.purposeOfVisit || "",
        guest.createdAt.toLocaleDateString(),
        guest.updatedAt.toLocaleDateString()
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      return csvContent;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }
}

export const guestDb = new GuestDatabase();
