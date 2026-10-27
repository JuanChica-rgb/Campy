import type { User } from '../types';

/** Producto de suscripción mensual en Google Play Console. */
export const PLUS_PRODUCT_ID = 'campy_plus_monthly';

export type PlusFeature = 'likes' | 'superlike' | 'note' | 'rewind';

export const PLUS_FEATURES: {
  id: PlusFeature;
  title: string;
  body: string;
}[] = [
  {
    id: 'likes',
    title: 'Ver quién te dio like',
    body: 'Miras la lista completa y decides si hacen match.'
  },
  {
    id: 'superlike',
    title: 'Super Like',
    body: 'Ilimitados. En sus chats sale: Te ha mandado un super like.'
  },
  {
    id: 'note',
    title: 'Mensaje',
    body: 'Uno por persona, antes del match. Si no quiere seguir, ahí queda.'
  },
  {
    id: 'rewind',
    title: 'Devolver',
    body: 'Recuperas el último perfil que pasaste.'
  }
];

export function hasPlus(user: User | null | undefined): boolean {
  if (!user?.plusUntil) return false;
  const until = Date.parse(user.plusUntil);
  return Number.isFinite(until) && until > Date.now();
}

export function plusGateMessage(feature: PlusFeature = 'likes'): string {
  switch (feature) {
    case 'likes':
      return 'Con Plus ves quién te dio like.';
    case 'superlike':
      return 'El Super Like es de Campy Plus.';
    case 'note':
      return 'El mensaje antes del match es de Campy Plus.';
    case 'rewind':
      return 'Devolver un perfil es de Campy Plus.';
    default:
      return 'Necesitas Campy Plus.';
  }
}
