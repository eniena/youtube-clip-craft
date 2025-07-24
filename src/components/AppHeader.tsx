import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Download } from 'lucide-react';

interface AppHeaderProps {
  currentPage: 'downloader' | 'history';
  onPageChange: (page: 'downloader' | 'history') => void;
}

export const AppHeader = ({ currentPage, onPageChange }: AppHeaderProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is preferred
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-sm mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* App Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FB Video Saver</h1>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex mt-4 bg-muted rounded-lg p-1">
          <button
            onClick={() => onPageChange('downloader')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'downloader'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Download
          </button>
          <button
            onClick={() => onPageChange('history')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
};