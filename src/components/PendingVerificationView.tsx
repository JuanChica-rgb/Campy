import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PendingVerificationView: React.FC = () => {
  const { currentUser, signOut } = useApp();
  const rejected = currentUser.verificationStatus === 'rejected';

  return (
    <div className="grid h-full min-h-full place-items-center bg-black px-6 pt-[calc(var(--campy-safe-top)+1.5rem)] pb-8 text-center text-white">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-display">
          {rejected ? 'Tu cuenta no fue aceptada' : 'Tu cuenta está en espera de verificación'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {rejected
            ? 'Revisamos la solicitud y no la aprobamos. Si crees que fue un error, escríbenos por WhatsApp.'
            : 'Ya recibimos tu solicitud. Te escribimos por WhatsApp para pedirte una foto de la cédula y del carné. Cuando la aprobemos, Campy se abre.'}
        </p>
        {currentUser.name ? (
          <p className="mt-4 text-xs text-slate-500">
            {currentUser.name}
            {currentUser.university ? ` · ${currentUser.university}` : ''}
          </p>
        ) : null}
        <button
          onClick={() => void signOut()}
          className="mt-8 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
