# Campy

App de citas para universitarios en Colombia. Web y Android. Solo 18+.

**Demo:** [campy-universitario.web.app](https://campy-universitario.web.app)

Conecta estudiantes verificados de la misma universidad: swipe, matches, chats, citas a ciegas y grupos de campus.

## Qué incluye

- Landing y app en el navegador (PWA)
- Auth por número + verificación de mayoría de edad
- Feed *Para ti* con swipe y perfiles
- Citas a ciegas (match por carrera e intereses)
- Chat 1:1 después del match
- Grupos con código de 6 caracteres
- Panel de revisión para perfiles
- App Android con Capacitor (AdMob en nativo)

## Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Backend:** Supabase (Auth, Postgres, RLS, Storage, Realtime)
- **Mobile:** Capacitor 8, Android
- **Hosting:** Firebase Hosting

## Desarrollo

```bash
npm install
cp .env.example .env   # completa URL y anon key de Supabase
npm run dev
```

Abre `http://localhost:3000`.

```bash
npm run build          # producción web
npm run cap:sync       # sincroniza Android
npm run apk            # APK de release (requiere keystore local)
```

Las claves, el keystore y los APK no van al repositorio. Usa `.env.example` como plantilla.

## Arquitectura (corto)

El cliente habla con Supabase. Las reglas RLS y funciones `security definer` cubren aprobación de perfiles, límites diarios y acciones sensibles. Android reutiliza el mismo build web.

## Licencia

Uso privado del autor. El código está publicado como portafolio.
