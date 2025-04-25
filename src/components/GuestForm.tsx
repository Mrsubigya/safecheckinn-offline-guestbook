import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Guest, guestDb } from "@/lib/db";
import IDUploader from './IDUploader';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface GuestFormProps {
  guestId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ guestId, isOpen, onClose, onSaved }) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState('');
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(new Date());
  const [roomNumber, setRoomNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [idFrontImage, setIdFrontImage] = useState<string>('');
  const [idBackImage, setIdBackImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadGuest = async () => {
      if (guestId) {
        try {
          const guest = await guestDb.getGuest(guestId);
          
          if (guest) {
            setName(guest.name);
            setCheckIn(new Date(guest.checkIn));
            setCheckOut(new Date(guest.checkOut));
            setRoomNumber(guest.roomNumber || '');
            setContactNumber(guest.contactNumber || '');
            setPurposeOfVisit(guest.purposeOfVisit || '');
            setIdFrontImage(guest.idFrontImage || '');
            setIdBackImage(guest.idBackImage || '');
          }
        } catch (error) {
          console.error('Error loading guest:', error);
          toast.error("Failed to load guest details");
        }
      }
    };
    
    if (isOpen && guestId) {
      loadGuest();
    }
  }, [guestId, isOpen]);
  
  useEffect(() => {
    if (!isOpen) {
      if (!guestId) {
        setName('');
        setCheckIn(new Date());
        setCheckOut(new Date());
        setRoomNumber('');
        setContactNumber('');
        setPurposeOfVisit('');
        setIdFrontImage('');
        setIdBackImage('');
      }
    }
  }, [isOpen, guestId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error("Guest name is required");
      return;
    }
    
    if (!checkIn || !checkOut) {
      toast.error("Check-in and check-out dates are required");
      return;
    }
    
    if (checkIn > checkOut) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const guestData = {
        name,
        checkIn: checkIn,
        checkOut: checkOut,
        roomNumber,
        contactNumber,
        purposeOfVisit,
        idFrontImage,
        idBackImage,
      };
      
      if (guestId) {
        await guestDb.updateGuest({ ...guestData, id: guestId });
      } else {
        await guestDb.addGuest(guestData);
      }
      
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast.error("Failed to save guest");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>{guestId ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Guest Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="check-in">
                  Check-in Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="check-out">
                  Check-out Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Room number"
                  className="w-full"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Phone number"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Textarea
                id="purpose"
                value={purposeOfVisit}
                onChange={(e) => setPurposeOfVisit(e.target.value)}
                placeholder="Purpose of visit (optional)"
                className="resize-none w-full"
                rows={2}
              />
            </div>
            
            <div className="w-full">
              <IDUploader
                frontImage={idFrontImage}
                backImage={idBackImage}
                onFrontImageChange={setIdFrontImage}
                onBackImageChange={setIdBackImage}
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : guestId ? 'Update Guest' : 'Add Guest'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GuestForm;
