import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RegisterModal } from './RegisterModal';
import { BrandMark } from './BrandMark';

export const AuthScreen: React.FC = () => {
  const { signIn, setIsRegisterOpen, isRegisterOpen, sessionUserId, users } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const profileMissing =
    !!sessionUserId && !users.some(user => user.id === sessionUserId);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const message = await signIn(phone, password);
    if (message) setError(message);
    setBusy(false);
  };

  return (
    <div className="grid h-full min-h-0 overflow-y-auto bg-black px-5 pb-6 pt-16 text-white md:grid-cols-2 md:place-items-center md:px-12 md:pt-6">
      <div className="hidden max-w-md md:block">
        <div className="flex items-center gap-3">
          <BrandMark size={48} />
          <p className="font-display text-2xl font-bold">Campy</p>
        </div>
        <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
          La app de citas para tu universidad
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Swipe, matches, chats y grupos. En computador se usa a pantalla completa; en el celular
          también.
        </p>
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-4 flex items-center gap-2.5 md:hidden">
          <BrandMark size={40} />
          <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Campy</p>
        </div>
        <h1 className="text-3xl font-bold font-display">Inicia sesión</h1>
        <p className="mt-2 text-sm text-slate-400">
          Universitarios verificados. La primera vez usa Crear cuenta.
        </p>

        {profileMissing && (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            Falta terminar tu perfil. Dale a Crear cuenta con el mismo número.
          </p>
        )}

        <form onSubmit={event => void submit(event)} className="mt-6 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Número / WhatsApp
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              required
              placeholder="WhatsApp"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-rose-400"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Contraseña
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-rose-400"
            />
          </label>
          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-rose-500 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="mt-3 w-full rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-200"
        >
          Crear cuenta
        </button>
      </div>
      {isRegisterOpen && <RegisterModal />}
    </div>
  );
};
