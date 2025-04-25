
import React from 'react';

const Watermark: React.FC = () => {
  return (
    <div 
      className="fixed bottom-4 right-4 opacity-20 select-none pointer-events-none z-50 text-xs text-right text-gray-500 font-light"
      style={{ 
        writingMode: 'vertical-rl', 
        textOrientation: 'mixed' 
      }}
    >
      <div>SafeCheckInn™</div>
      <div>Developed by Fewzon</div>
      <div>© 2025 Fewzon. All rights reserved.</div>
    </div>
  );
};

export default Watermark;
