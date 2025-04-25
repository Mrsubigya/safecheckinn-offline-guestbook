
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IDUploaderProps {
  frontImage?: string;
  backImage?: string;
  onFrontImageChange: (imageData: string) => void;
  onBackImageChange: (imageData: string) => void;
}

const IDUploader: React.FC<IDUploaderProps> = ({ 
  frontImage, 
  backImage, 
  onFrontImageChange, 
  onBackImageChange 
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back'
  ) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast.error("Only JPG and PNG images are supported");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      
      if (type === 'front') {
        onFrontImageChange(imageData);
      } else {
        onBackImageChange(imageData);
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the image");
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">ID Document Images</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front ID Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Front of ID
          </label>
          
          <input
            type="file"
            ref={frontInputRef}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleImageUpload(e, 'front')}
          />
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => frontInputRef.current?.click()}
          >
            {frontImage ? (
              <img 
                src={frontImage} 
                alt="Front ID" 
                className="max-h-40 max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Click to upload front of ID
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG or PNG, max 5MB
                </p>
              </div>
            )}
          </div>
          
          {frontImage && (
            <div className="flex justify-end">
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => onFrontImageChange('')}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
        
        {/* Back ID Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Back of ID
          </label>
          
          <input
            type="file"
            ref={backInputRef}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) => handleImageUpload(e, 'back')}
          />
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => backInputRef.current?.click()}
          >
            {backImage ? (
              <img 
                src={backImage} 
                alt="Back ID" 
                className="max-h-40 max-w-full object-contain" 
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Click to upload back of ID
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG or PNG, max 5MB
                </p>
              </div>
            )}
          </div>
          
          {backImage && (
            <div className="flex justify-end">
              <Button
                variant="outline" 
                size="sm"
                onClick={() => onBackImageChange('')}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDUploader;
