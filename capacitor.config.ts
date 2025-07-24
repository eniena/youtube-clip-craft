import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4ce8cb2719174030a1624e163ad14312',
  appName: 'FB Video Saver',
  webDir: 'dist',
  server: {
    url: 'https://4ce8cb27-1917-4030-a162-4e163ad14312.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1877F2',
      showSpinner: false
    }
  }
};

export default config;