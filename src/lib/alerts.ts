import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL = 'campy';

function notificationId(key: string) {
  let hash = 0;
  for (const ch of key) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return (hash % 2147483646) + 1;
}

export async function prepareAlerts() {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.createChannel({
    id: CHANNEL,
    name: 'Matches y mensajes',
    description: 'Avisos cuando hay un match o un mensaje nuevo',
    importance: 4,
    visibility: 1,
    vibration: true
  });
  const perms = await LocalNotifications.checkPermissions();
  if (perms.display === 'prompt' || perms.display === 'prompt-with-rationale') {
    await LocalNotifications.requestPermissions();
  }
}

export async function showAlert(
  key: string,
  title: string,
  body: string,
  extra?: Record<string, unknown>
) {
  if (!Capacitor.isNativePlatform()) return;
  const perms = await LocalNotifications.checkPermissions();
  if (perms.display !== 'granted') return;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: notificationId(key),
        title,
        body,
        channelId: CHANNEL,
        extra
      }
    ]
  });
}

export function watchAlertTaps(handler: (extra: Record<string, unknown>) => void) {
  if (!Capacitor.isNativePlatform()) return () => undefined;
  const pending = LocalNotifications.addListener('localNotificationActionPerformed', event => {
    handler((event.notification.extra as Record<string, unknown>) ?? {});
  });
  return () => {
    void pending.then(handle => handle.remove());
  };
}
