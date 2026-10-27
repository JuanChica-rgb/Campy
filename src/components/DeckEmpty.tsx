import React, { useEffect, useState } from 'react';

interface DeckEmptyProps {
  photoUrl: string;
  modeName?: string;
  hint?: string;
  onGoHome?: () => void;
  onReplay?: () => void;
}

export const DeckEmpty: React.FC<DeckEmptyProps> = ({ photoUrl, modeName, hint, onGoHome, onReplay }) => {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!onGoHome) return;
    if (seconds <= 0) {
      onGoHome();
      return;
    }
    const timer = window.setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, onGoHome]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-6 text-center text-white">
      <div className="flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-slate-800/80">
        <img src={photoUrl} alt="" className="h-24 w-24 rounded-full object-cover ring-2 ring-white" />
      </div>
      <h2 className="mt-6 text-xl font-semibold font-display">
        {onGoHome ? `Cambiando a Para ti en ${Math.max(seconds, 0)}` : 'Ya viste todos los perfiles'}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
        {hint
          ? hint
          : modeName
            ? `Ya viste todos los perfiles en ${modeName}. Te mostramos más en Para ti.`
            : 'Ya viste todos los perfiles de Para ti. Puedes volver a verlos.'}
      </p>
      {onGoHome ? (
        <button
          onClick={onGoHome}
          className="mt-6 w-full max-w-xs rounded-full bg-white py-3 text-sm font-semibold text-slate-900"
        >
          Ir a Para ti
        </button>
      ) : (
        <button
          onClick={onReplay}
          className="mt-6 w-full max-w-xs rounded-full bg-white py-3 text-sm font-semibold text-slate-900"
        >
          Volver a ver perfiles
        </button>
      )}
    </div>
  );
};
