
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Guest, GuestFilter } from '@/lib/db';

interface FilterBarProps {
  onFilterChange: (filter: GuestFilter) => void;
  onAddGuest: () => void;
  onExport: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onAddGuest, onExport }) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<keyof Guest>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onFilterChange({
      searchText: value,
      sortBy,
      sortDirection,
    });
  };
  
  const handleSortChange = (value: string) => {
    const newSortBy = value as keyof Guest;
    setSortBy(newSortBy);
    onFilterChange({
      searchText,
      sortBy: newSortBy,
      sortDirection,
    });
  };
  
  const handleDirectionChange = (value: string) => {
    const newDirection = value as 'asc' | 'desc';
    setSortDirection(newDirection);
    onFilterChange({
      searchText,
      sortBy,
      sortDirection: newDirection,
    });
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 justify-between">
      <div className="flex flex-1 items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search guests..."
            value={searchText}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Guest Name</SelectItem>
              <SelectItem value="checkIn">Check-in Date</SelectItem>
              <SelectItem value="checkOut">Check-out Date</SelectItem>
              <SelectItem value="roomNumber">Room Number</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={sortDirection} 
            onValueChange={handleDirectionChange}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={onExport}
          className="flex-1 sm:flex-none"
        >
          Export CSV
        </Button>
        <Button 
          onClick={onAddGuest}
          className="flex-1 sm:flex-none"
        >
          Add Guest
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
