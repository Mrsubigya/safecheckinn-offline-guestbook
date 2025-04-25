
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white py-4">
      <div className="container-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-excel-text">SafeCheckInn</h1>
            <p className="text-sm text-excel-muted">Offline Guest Management</p>
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
