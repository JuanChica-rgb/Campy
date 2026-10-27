import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';

export const INTERSTITIAL_AD_ID =
  (import.meta.env.VITE_ADMOB_INTERSTITIAL_ID as string | undefined) ||
  'ca-app-pub-5089416524900846/4986265535';

let ready = false;
let boot: Promise<boolean> | null = null;
let showing = false;
let loaded = false;
let loading = false;

async function ensureAds(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (ready) return true;
  boot ||= (async () => {
    await AdMob.initialize();
    const info = await AdMob.requestConsentInfo();
    if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
      const form = await AdMob.showConsentForm();
      if (!form.canRequestAds) return false;
    } else if (!info.canRequestAds) {
      return false;
    }
    ready = true;
    return true;
  })().catch(err => {
    boot = null;
    console.error(err);
    return false;
  });
  return boot;
}

async function preloadInterstitial() {
  if (!Capacitor.isNativePlatform() || loading || loaded) return;
  if (!(await ensureAds())) return;
  loading = true;
  try {
    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
    loaded = true;
  } catch (err) {
    loaded = false;
    console.error(err);
  } finally {
    loading = false;
  }
}

/** Call once when the native app starts so the first interstitial is ready sooner. */
export async function prepareAds() {
  if (!(await ensureAds())) return;
  await preloadInterstitial();
}

/** Interstitial after every N swipes. No-op on web. */
export async function showSwipeAd() {
  if (showing) return;
  if (!(await ensureAds())) return;
  showing = true;
  try {
    if (!loaded) {
      await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_ID });
      loaded = true;
    }
    await AdMob.showInterstitial();
  } catch (err) {
    console.error(err);
  } finally {
    loaded = false;
    showing = false;
    void preloadInterstitial();
  }
}
