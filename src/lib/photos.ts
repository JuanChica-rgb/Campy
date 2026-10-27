import { supabase } from './supabase';

function shrinkPhoto(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudo preparar la foto.'));
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('No se pudo preparar la foto.'));
            return;
          }
          resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.82
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Ese archivo no es una foto válida.'));
    };
    image.src = objectUrl;
  });
}

async function uploadUserImage(
  userId: string,
  file: File,
  folder?: string
): Promise<{ url?: string; error?: string }> {
  if (!supabase) return { error: 'Sin conexión con el servidor.' };
  if (!file.type.startsWith('image/')) return { error: 'Solo puedes subir fotos.' };
  try {
    const prepared = await shrinkPhoto(file);
    const path = folder
      ? `${userId}/${folder}/${crypto.randomUUID()}.jpg`
      : `${userId}/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from('profile-photos').upload(path, prepared, {
      contentType: 'image/jpeg',
      upsert: false
    });
    if (error) return { error: 'No se pudo subir la foto. Prueba con otra.' };
    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'No se pudo subir la foto.' };
  }
}

export async function uploadProfilePhoto(userId: string, file: File) {
  return uploadUserImage(userId, file);
}

export async function uploadGroupCover(userId: string, file: File) {
  return uploadUserImage(userId, file, 'covers');
}

export async function uploadProfilePhotos(
  userId: string,
  files: File[]
): Promise<{ urls?: string[]; error?: string }> {
  const urls: string[] = [];
  for (const file of files) {
    const result = await uploadProfilePhoto(userId, file);
    if (result.error || !result.url) return { error: result.error || 'No se pudo subir la foto.' };
    urls.push(result.url);
  }
  return { urls };
}
