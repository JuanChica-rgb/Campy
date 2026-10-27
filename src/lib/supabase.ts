import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export const ADMIN_EMAIL = 'juanmiguel71293@gmail.com';

/** Números de admin / desarrollador (solo dígitos). */
export const ADMIN_PHONES = new Set(['3205327992', '573205327992', '123456789', '987654321']);

export function isAdminEmail(email?: string | null) {
  const value = (email ?? '').trim().toLowerCase();
  if (!value) return false;
  if (value === ADMIN_EMAIL) return true;
  const match = /^(\d+)@phone\.campy\.app$/.exec(value);
  return !!match && ADMIN_PHONES.has(match[1]);
}

export function authErrorMessage(raw: string) {
  const text = raw.toLowerCase();
  if (text.includes('invalid login') || text.includes('invalid credentials')) {
    return 'Esa cuenta todavía no existe, o la contraseña no coincide. La primera vez dale a Crear cuenta.';
  }
  if (text.includes('already registered') || text.includes('already been registered')) {
    return 'Ya existe una cuenta con ese número.';
  }
  if (text.includes('password')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (raw.includes('Debes tener 18') || raw.includes('Confirma que eres mayor')) {
    return raw;
  }
  if (text.includes('inicia sesión')) {
    return 'Inicia sesión para continuar.';
  }
  return 'No se pudo completar. Revisa los datos e inténtalo otra vez.';
}
