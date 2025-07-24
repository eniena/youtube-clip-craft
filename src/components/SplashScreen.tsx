import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import appIcon from '@/assets/app-icon.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-bg animate-fade-in">
      <div className="text-center space-y-6">
        {/* App Icon */}
        <div className="relative">
          <img 
            src={appIcon} 
            alt="FB Video Saver"
            className="w-24 h-24 mx-auto rounded-2xl shadow-2xl animate-pulse-soft"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Download className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">FB Video Saver</h1>
          <p className="text-white/80 text-sm">Professional Video Downloader</p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};