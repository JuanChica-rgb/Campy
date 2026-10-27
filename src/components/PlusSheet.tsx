import React from 'react';
import { Heart, RotateCcw, Send, Star } from 'lucide-react';
import { PLUS_FEATURES, PLUS_PRODUCT_ID, hasPlus } from '../lib/plus';
import { useApp } from '../context/AppContext';

const ICONS = {
  likes: Heart,
  superlike: Star,
  note: Send,
  rewind: RotateCcw
} as const;

type Props = {
  onClose: () => void;
  highlight?: keyof typeof ICONS;
};

export const PlusSheet: React.FC<Props> = ({ onClose, highlight }) => {
  const { currentUser } = useApp();
  const active = hasPlus(currentUser);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-3 pb-[calc(1rem+var(--campy-safe-bottom))] sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-white"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-labelledby="plus-title"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Campy Plus</p>
        <h2 id="plus-title" className="mt-1 text-2xl font-semibold font-display">
          {active ? 'Plus activo' : 'Una suscripción al mes'}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          El like normal y el chat después del match siguen gratis. Plus desbloquea esto:
        </p>
        <ul className="mt-5 space-y-3">
          {PLUS_FEATURES.map(perk => {
            const Icon = ICONS[perk.id];
            const focused = highlight === perk.id;
            return (
              <li
                key={perk.id}
                className={`flex gap-3 rounded-2xl px-2 py-1.5 ${
                  focused ? 'bg-rose-500/10 ring-1 ring-rose-400/30' : ''
                }`}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                <span>
                  <span className="block text-sm font-semibold">{perk.title}</span>
                  <span className="block text-xs text-slate-400">{perk.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          Cobro por Google Play ({PLUS_PRODUCT_ID}). El precio lo defines en Play Console. El botón de
          pago se activa cuando el producto esté publicado ahí.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900"
        >
          {active ? 'Cerrar' : 'Entendido'}
        </button>
      </div>
    </div>
  );
};
