const PHONE_AUTH_DOMAIN = 'phone.campy.app';

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  return digits.length >= 1 && digits.length <= 15;
}

/** Supabase Auth sigue pidiendo email; usamos número@phone.campy.app por debajo. */
export function authEmailFromPhone(phone: string): string {
  const digits = normalizePhone(phone);
  return `${digits}@${PHONE_AUTH_DOMAIN}`;
}

export function displayPhone(phone: string): string {
  const digits = normalizePhone(phone);
  if (!digits) return phone.trim();
  if (digits.startsWith('57') && digits.length > 10) {
    return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  return digits;
}
