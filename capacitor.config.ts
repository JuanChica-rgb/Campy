import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campy.universitario',
  appName: 'Campy',
  webDir: 'dist',
  android: {
    backgroundColor: '#000000',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
      overlaysWebView: false,
    },
    SystemBars: {
      style: 'DARK',
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_campy',
      iconColor: '#F43F5E',
    },
  },
};

export default config;
