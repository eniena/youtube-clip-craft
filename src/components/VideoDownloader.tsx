import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Link2, Play, AlertTriangle, CheckCircle } from 'lucide-react';

interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  qualities: Array<{
    quality: string;
    size: string;
    url: string;
  }>;
}

export const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Validate Facebook URL
  const isValidFacebookUrl = (url: string): boolean => {
    const fbPatterns = [
      /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/\d+/,
      /^https?:\/\/(www\.)?fb\.watch\/[a-zA-Z0-9]+/,
      /^https?:\/\/(www\.)?facebook\.com\/watch\/\?v=\d+/
    ];
    return fbPatterns.some(pattern => pattern.test(url));
  };

  // Fetch video metadata (mock implementation)
  const fetchVideoMetadata = async (videoUrl: string) => {
    setIsLoading(true);
    
    try {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock video data (in real implementation, this would call your backend API)
      const mockVideoData: VideoMetadata = {
        id: Date.now().toString(),
        title: 'Sample Facebook Video Title - Nature Documentary',
        thumbnail: 'https://picsum.photos/400/225?random=' + Math.random(),
        duration: '3:45',
        qualities: [
          { quality: 'HD (720p)', size: '45.2 MB', url: 'mock-hd-url' },
          { quality: 'SD (480p)', size: '28.7 MB', url: 'mock-sd-url' },
          { quality: 'Low (360p)', size: '18.3 MB', url: 'mock-low-url' }
        ]
      };
      
      setVideoData(mockVideoData);
      setSelectedQuality(mockVideoData.qualities[0].quality);
      
      toast({
        title: "Video Found!",
        description: "Video metadata loaded successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch video metadata. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!videoData || !selectedQuality) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            
            // Save to download history
            const downloadItem = {
              id: videoData.id,
              title: videoData.title,
              thumbnail: videoData.thumbnail,
              quality: selectedQuality,
              downloadedAt: new Date().toISOString(),
              size: videoData.qualities.find(q => q.quality === selectedQuality)?.size || '0 MB'
            };
            
            const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
            history.unshift(downloadItem);
            localStorage.setItem('downloadHistory', JSON.stringify(history.slice(0, 50))); // Keep only 50 items
            
            toast({
              title: "Download Complete!",
              description: "Video saved to your device.",
            });
            
            // Reset form
            setUrl('');
            setVideoData(null);
            setSelectedQuality('');
            
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
    } catch (error) {
      setIsDownloading(false);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the video.",
        variant: "destructive",
      });
    }
  };

  // Handle fetch video
  const handleFetchVideo = () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Facebook video URL.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidFacebookUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Facebook video URL.",
        variant: "destructive",
      });
      return;
    }
    
    fetchVideoMetadata(url);
  };

  // Auto-detect clipboard content
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          const text = await navigator.clipboard.readText();
          if (text && isValidFacebookUrl(text) && !url) {
            setUrl(text);
            toast({
              title: "URL Detected",
              description: "Facebook URL found in clipboard!",
            });
          }
        }
      } catch (error) {
        // Clipboard access denied or not available
      }
    };
    
    checkClipboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Paste Facebook Video URL</h2>
        </div>
        
        <div className="space-y-3">
          <Input
            placeholder="https://www.facebook.com/watch/?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base"
          />
          
          <Button 
            onClick={handleFetchVideo}
            disabled={isLoading || !url.trim()}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Fetching Video...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Fetch Video
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Video Preview Section */}
      {videoData && (
        <Card className="p-6 space-y-4 animate-slide-up video-card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold">Video Ready</h3>
          </div>
          
          <div className="space-y-4">
            {/* Video Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={videoData.thumbnail} 
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                {videoData.duration}
              </Badge>
            </div>
            
            {/* Video Info */}
            <div>
              <h4 className="font-medium text-card-foreground line-clamp-2">
                {videoData.title}
              </h4>
            </div>
            
            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Select Quality:
              </label>
              <div className="grid gap-2">
                {videoData.qualities.map((quality) => (
                  <label 
                    key={quality.quality}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <input
                      type="radio"
                      name="quality"
                      value={quality.quality}
                      checked={selectedQuality === quality.quality}
                      onChange={(e) => setSelectedQuality(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="font-medium">{quality.quality}</span>
                      <span className="text-sm text-muted-foreground">{quality.size}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Download Progress */}
            {isDownloading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Downloading...</span>
                  <span>{Math.round(downloadProgress)}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
              </div>
            )}
            
            {/* Download Button */}
            <Button 
              onClick={handleDownload}
              disabled={isDownloading || !selectedQuality}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Downloading {Math.round(downloadProgress)}%
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Video
                </div>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Legal Notice */}
      <Card className="p-4 bg-warning/10 border-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-medium text-warning-foreground">Legal Notice</h4>
            <p className="text-sm text-warning-foreground/80">
              This app only downloads public videos. Downloading content is your responsibility. 
              We do not host or store any Facebook content. Please respect copyright laws and Facebook's terms of service.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};