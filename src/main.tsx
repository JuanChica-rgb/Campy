import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function readCssPx(name: string) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name) || '0';
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

async function setupNativeChrome() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    // Android 15+ may ignore this; CSS insets still apply.
  }

  try {
    await StatusBar.setBackgroundColor({ color: '#000000' });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    // ignore
  }

  try {
    // If Capacitor/SystemBars did not inject insets, fill them so Para ti / nav sit correctly.
    if (readCssPx('--safe-area-inset-top') < 20) {
      const info = await StatusBar.getInfo();
      if (info.height && info.height > 0) {
        document.documentElement.style.setProperty('--safe-area-inset-top', `${info.height}px`);
      } else {
        document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
      }
    }
    if (readCssPx('--safe-area-inset-bottom') < 12) {
      document.documentElement.style.setProperty('--safe-area-inset-bottom', '22px');
    }
  } catch {
    if (readCssPx('--safe-area-inset-top') < 20) {
      document.documentElement.style.setProperty('--safe-area-inset-top', '32px');
    }
    if (readCssPx('--safe-area-inset-bottom') < 12) {
      document.documentElement.style.setProperty('--safe-area-inset-bottom', '22px');
    }
  }
}

void setupNativeChrome();

if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js');
  });
}

createRoot(document.getElementById('root')!).render(<App />);
