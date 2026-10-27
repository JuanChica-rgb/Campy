import React, { useRef, useState } from 'react';
import { Heart, ShieldCheck, Users, Sparkles, MessageCircle, ChevronRight, Download } from 'lucide-react';
import { BrandMark } from './BrandMark';

/** Ponlo en true cuando quieras mostrar otra vez la descarga de la APK. */
const SHOW_ANDROID_APK = false;
const APK_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/app-public/Campy.apk`;

const DEMO = [
  {
    name: 'Valentina',
    age: 20,
    career: 'Psicología',
    uni: 'Universidad Nacional',
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    bio: 'Café, playlists y planes de campus.'
  },
  {
    name: 'Mateo',
    age: 21,
    career: 'Ingeniería Mecatrónica',
    uni: 'Universidad de Antioquia',
    photo:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Proyectos, fútbol y una buena conversación.'
  },
  {
    name: 'Camila',
    age: 19,
    career: 'Diseño',
    uni: 'Universidad de los Andes',
    photo:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    bio: 'Arte, cine y grupos de lectura.'
  }
];

function DemoSwipe() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const person = DEMO[index % DEMO.length];
  const likeHint = Math.max(0, Math.min(1, dragX / 120));
  const passHint = Math.max(0, Math.min(1, -dragX / 120));

  const finish = (dir: 'like' | 'pass') => {
    setDragX(dir === 'like' ? 360 : -360);
    window.setTimeout(() => {
      setIndex(value => value + 1);
      setDragX(0);
      setDragging(false);
    }, 180);
  };

  return (
    <div
      className="relative h-full w-full touch-none select-none overflow-hidden rounded-[1.35rem] bg-slate-900"
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 28}deg)`,
        transition: dragging ? 'none' : 'transform 180ms ease-out'
      }}
      onPointerDown={event => {
        startX.current = event.clientX;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        if (!dragging) return;
        setDragX(event.clientX - startX.current);
      }}
      onPointerUp={event => {
        if (!dragging) return;
        setDragging(false);
        const delta = event.clientX - startX.current;
        if (delta > 90) finish('like');
        else if (delta < -90) finish('pass');
        else setDragX(0);
      }}
      onPointerCancel={() => {
        setDragging(false);
        setDragX(0);
      }}
    >
      <img
        src={person.photo}
        alt=""
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-[#F43F5E]/70" style={{ opacity: likeHint * 0.5 }} />
      <div className="pointer-events-none absolute inset-0 bg-sky-500/70" style={{ opacity: passHint * 0.5 }} />
      <div
        className="pointer-events-none absolute left-4 top-8 rounded-lg border-4 border-[#F43F5E] px-3 py-1 text-xl font-black tracking-wide text-[#F43F5E] rotate-[-12deg]"
        style={{ opacity: likeHint }}
      >
        LIKE
      </div>
      <div
        className="pointer-events-none absolute right-4 top-8 rounded-lg border-4 border-sky-400 px-3 py-1 text-xl font-black tracking-wide text-sky-300 rotate-[12deg]"
        style={{ opacity: passHint }}
      >
        NOPE
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-200">Demo</p>
        <h3 className="font-display text-2xl font-bold">
          {person.name} <span className="font-medium text-slate-300">{person.age}</span>
        </h3>
        <p className="mt-1 text-sm text-slate-200">{person.career}</p>
        <p className="text-xs text-slate-400">{person.uni}</p>
        <p className="mt-2 text-sm text-slate-300">{person.bio}</p>
      </div>
    </div>
  );
}

function PhoneDemo() {
  return (
    <div className="mx-auto w-full max-w-[420px] lg:max-w-[480px]">
      <div className="relative h-[min(620px,72dvh)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_28px_80px_-24px_rgba(244,63,94,0.4)] lg:h-[min(740px,80dvh)]">
        <DemoSwipe />
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">
        Arrastra a la derecha si te gusta, a la izquierda para pasar.
      </p>
    </div>
  );
}

interface LandingPageProps {
  onEnter: (register: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="h-full overflow-x-hidden overflow-y-auto bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/85 pt-[var(--campy-safe-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark size={36} />
            <span className="font-display text-lg font-bold">Campy</span>
          </div>
          <button
            type="button"
            onClick={() => onEnter(false)}
            className="shrink-0 rounded-full bg-[#F43F5E] px-4 py-2.5 text-sm font-bold text-white"
          >
            Usar Campy
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 sm:px-8 md:pb-20">
        <section className="grid min-h-[calc(100dvh-4.5rem)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-300">
              Citas universitarias · 18+
            </p>
            <h1 className="mt-3 font-display text-[2.35rem] font-bold leading-tight sm:text-6xl">
              Conecta con gente de tu universidad
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
              Campy se usa aquí mismo, en el navegador: swipe, matches, chats y grupos. También
              está en Android.
            </p>
            <div className="mt-6 hidden flex-wrap gap-3 md:flex">
              <button
                type="button"
                onClick={() => onEnter(true)}
                className="rounded-full bg-[#F43F5E] px-5 py-3 text-sm font-bold text-white"
              >
                Crear cuenta
              </button>
              <button
                type="button"
                onClick={() => onEnter(false)}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
              >
                Ya tengo cuenta
              </button>
              {SHOW_ANDROID_APK ? (
                <a
                  href={APK_URL}
                  download="Campy.apk"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
                >
                  <Download className="h-4 w-4" />
                  Descargar Android
                </a>
              ) : null}
            </div>
          </div>
          <PhoneDemo />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Heart,
              title: 'Para ti',
              text: 'Desliza a la derecha si te gusta, a la izquierda si no. Si ambos dan like, hay match.'
            },
            {
              icon: Sparkles,
              title: 'Citas a ciegas',
              text: 'Conecta por carrera e intereses, sin ver la foto al principio.'
            },
            {
              icon: Users,
              title: 'Grupos',
              text: 'Crea o entra con un código de 6 caracteres. El chat se guarda entre dispositivos.'
            }
          ].map(item => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <item.icon className="h-5 w-5 text-[#F43F5E]" />
              <h2 className="mt-3 font-display text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900/50 p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Cómo funciona</h2>
          <ol className="mt-5 space-y-4">
            {[
              'Crea cuenta con WhatsApp, confirma que eres mayor de 18 y sube fotos.',
              'Espera la verificación universitaria. Sin eso no se ve el resto de perfiles.',
              'En Para ti desliza, mira más fotos tocando izquierda o derecha, y abre el perfil para ver preferencias.',
              'Si hay match, aparece el chat. También puedes crear grupos o entrar con un código.'
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-950">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => onEnter(true)}
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-rose-200"
          >
            Probar ahora <ChevronRight className="h-4 w-4" />
          </button>
        </section>

        {SHOW_ANDROID_APK ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Download className="mt-0.5 h-5 w-5 shrink-0 text-[#F43F5E]" />
              <div>
                <h2 className="font-display text-2xl font-bold">App Android</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                  Misma cuenta, mismos chats. Android 8 o superior. Como aún no está en Play Store,
                  el teléfono pedirá permitir instalar apps de este sitio.
                </p>
                <a
                  href={APK_URL}
                  download="Campy.apk"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#F43F5E] px-5 py-3 text-sm font-bold text-white"
                >
                  <Download className="h-4 w-4" />
                  Descargar Campy.apk
                </a>
                <ol className="mt-5 space-y-2 text-sm text-slate-400">
                  <li>1. Abre este sitio en el celular y pulsa descargar.</li>
                  <li>2. Si Android avisa, elige Instalar de todas formas / Permitir esta fuente.</li>
                  <li>3. Abre Campy, crea cuenta con WhatsApp y espera la verificación 18+.</li>
                </ol>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-8 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm text-emerald-200">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p>
            Solo mayores de 18. Los perfiles pasan por revisión. Puedes denunciar y bloquear desde
            la tarjeta o el perfil.
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-slate-500 sm:px-6 md:pb-8 pb-28">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4">
          <a className="hover:text-white" href="./legal/index.html">
            Eliminar cuenta
          </a>
          <a className="hover:text-white" href="./legal/seguridad-ninos.html">
            Seguridad de menores
          </a>
          <a className="hover:text-white" href="./legal/csae.html">
            CSAE
          </a>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            juanmiguel71293@gmail.com
          </span>
        </div>
        <p className="mt-4">Campy · Colombia</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/95 px-4 pt-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          {SHOW_ANDROID_APK ? (
            <a
              href={APK_URL}
              download="Campy.apk"
              className="flex flex-1 items-center justify-center gap-1 rounded-full border border-white/15 py-3 text-sm font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              App
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onEnter(false)}
            className="flex-1 rounded-full border border-white/15 py-3 text-sm font-semibold text-white"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => onEnter(true)}
            className="flex-[1.4] rounded-full bg-[#F43F5E] py-3 text-sm font-bold text-white"
          >
            Usar Campy
          </button>
        </div>
      </div>
    </div>
  );
};
