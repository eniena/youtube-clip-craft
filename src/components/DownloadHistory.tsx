import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  History, 
  Play, 
  Trash2, 
  Share, 
  Calendar,
  HardDrive,
  Video 
} from 'lucide-react';

interface DownloadItem {
  id: string;
  title: string;
  thumbnail: string;
  quality: string;
  downloadedAt: string;
  size: string;
}

export const DownloadHistory = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load download history from localStorage
    const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    setDownloads(history);
  }, []);

  const handleDelete = (id: string) => {
    const updatedDownloads = downloads.filter(item => item.id !== id);
    setDownloads(updatedDownloads);
    localStorage.setItem('downloadHistory', JSON.stringify(updatedDownloads));
    
    toast({
      title: "Deleted",
      description: "Video removed from history.",
    });
  };

  const handlePlay = (item: DownloadItem) => {
    // In a real app, this would open the video file
    toast({
      title: "Opening Video",
      description: `Playing ${item.title}`,
    });
  };

  const handleShare = (item: DownloadItem) => {
    // In a real app, this would use Capacitor's Share plugin
    toast({
      title: "Share Video",
      description: "Video sharing functionality would open here.",
    });
  };

  const clearAllHistory = () => {
    setDownloads([]);
    localStorage.setItem('downloadHistory', JSON.stringify([]));
    
    toast({
      title: "History Cleared",
      description: "All download history has been removed.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (downloads.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Downloads Yet</h3>
        <p className="text-muted-foreground">
          Downloaded videos will appear here for easy access.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Download History</h2>
          <Badge variant="secondary">{downloads.length}</Badge>
        </div>
        
        {downloads.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAllHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Download List */}
      <div className="space-y-3">
        {downloads.map((item) => (
          <Card key={item.id} className="p-4 video-card">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={item.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-card-foreground line-clamp-2 mb-2">
                  {item.title}
                </h4>
                
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.downloadedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {item.size}
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {item.quality}
                  </Badge>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handlePlay(item)}
                    className="flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShare(item)}
                  >
                    <Share className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};