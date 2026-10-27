import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { isNativeApp, leaveWebApp } from '../lib/webApp';

export const WebAppFrame: React.FC<{
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}> = ({ children, showBack, onBack }) => {
  if (isNativeApp()) return <>{children}</>;

  const back = () => {
    leaveWebApp();
    onBack?.();
  };

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-black">
      {showBack && (
        <button
          type="button"
          onClick={back}
          className="absolute left-4 top-[calc(0.85rem+var(--campy-safe-top))] z-50 inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Inicio
        </button>
      )}
      <div className="h-full min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};
