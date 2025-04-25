
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white py-4">
      <div className="container-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/cd2eeb07-8b15-4e9e-a218-696683c1b5d9.png" 
              alt="SafeCheckInn Logo" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-2xl font-bold text-excel-text">SafeCheckInn</h1>
              <p className="text-sm text-excel-muted">Offline Guest Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Offline Mode
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
