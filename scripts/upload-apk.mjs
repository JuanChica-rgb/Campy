import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const phone = process.env.CAMPY_UPLOAD_PHONE;
const password = process.env.CAMPY_UPLOAD_PASSWORD;
const apkPath = path.resolve('dist', 'Campy.apk');

if (!url || !key) {
  console.error('Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}
if (!phone || !password) {
  console.error('Define CAMPY_UPLOAD_PHONE y CAMPY_UPLOAD_PASSWORD de una cuenta admin.');
  process.exit(1);
}
if (!fs.existsSync(apkPath)) {
  console.error('No está dist/Campy.apk. Corre npm run apk.');
  process.exit(1);
}

const supabase = createClient(url, key);
const email = `${String(phone).replace(/\D/g, '')}@phone.campy.app`;
const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
if (authError) {
  console.error(authError.message);
  process.exit(1);
}

const file = fs.readFileSync(apkPath);
const { error: removeError } = await supabase.storage.from('app-public').remove(['Campy.apk']);
if (removeError && !/not found|not exist/i.test(removeError.message)) {
  console.warn(removeError.message);
}

const { error: uploadError } = await supabase.storage.from('app-public').upload('Campy.apk', file, {
  contentType: 'application/vnd.android.package-archive',
  upsert: true,
  cacheControl: '300'
});
if (uploadError) {
  console.error(uploadError.message);
  process.exit(1);
}

const { data } = supabase.storage.from('app-public').getPublicUrl('Campy.apk');
console.log(`APK publicada: ${data.publicUrl}`);
