import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skinbase.app',
  appName: 'SkinBase',
  webDir: 'out',
  server: {
    url: 'https://skinbaseapp.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FBE9E4',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#FBE9E4',
    },
  },
};

export default config;
