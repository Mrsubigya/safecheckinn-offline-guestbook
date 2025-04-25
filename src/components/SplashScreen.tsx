
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className={cn(
        "flex flex-col items-center gap-4",
        "animate-[enter_1s_ease-out]"
      )}>
        <img 
          src="/lovable-uploads/cd2eeb07-8b15-4e9e-a218-696683c1b5d9.png" 
          alt="SafeCheckInn Logo" 
          className="w-32 h-32 animate-[scale-in_0.5s_ease-out]"
        />
        <h1 className="text-3xl font-bold text-excel-text animate-[fade-in_0.5s_ease-out_0.5s_forwards] opacity-0">
          SafeCheckInn
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
