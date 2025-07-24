import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { VideoDownloader } from '@/components/VideoDownloader';
import { DownloadHistory } from '@/components/DownloadHistory';
import { SplashScreen } from '@/components/SplashScreen';
import { NotificationHandler } from '@/components/NotificationHandler';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'downloader' | 'history'>('downloader');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background mobile-container">
      <NotificationHandler />
      <AppHeader currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="px-4 py-6 pb-20">
        {currentPage === 'downloader' ? (
          <VideoDownloader />
        ) : (
          <DownloadHistory />
        )}
      </main>
    </div>
  );
};

export default Index;
