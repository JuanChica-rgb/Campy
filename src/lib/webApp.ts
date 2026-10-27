import { Capacitor } from '@capacitor/core';

const FLAG = 'campy_web_app';

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function wantsWebApp() {
  if (isNativeApp()) return true;
  try {
    if (sessionStorage.getItem(FLAG) === '1') return true;
    if (window.location.hash === '#app') return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function enterWebApp() {
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* ignore */
  }
  if (window.location.hash !== '#app') {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#app`);
  }
}

export function leaveWebApp() {
  try {
    sessionStorage.removeItem(FLAG);
  } catch {
    /* ignore */
  }
  if (window.location.hash === '#app') {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
}

export function openLanding() {
  leaveWebApp();
  window.dispatchEvent(new Event('campy-open-landing'));
}
