import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlindCard } from './BlindCard';
import { EyeOff, RefreshCw, Shield, Sparkles, AlertCircle } from 'lucide-react';

export const BlindDatingView: React.FC = () => {
  const {
    currentUser,
    users,
    blindSwipedUserIds,
    handleSwipe,
    resetSwipes
  } = useApp();

  const candidateUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    if (user.verificationStatus !== 'approved') return false;
    if (user.role === 'admin') return false;
    if (blindSwipedUserIds.has(user.id)) return false;
    return true;
  });

  const activeCardUser = candidateUsers[0];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Explanation Banner */}
      <div className="w-full max-w-md mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <EyeOff className="h-4 w-4" />
            </span>
            <h1 className="text-base font-bold text-white font-display">Citas a Ciegas Campus</h1>
          </div>
          <span className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
            <Shield className="h-3 w-3" /> Fotos bloqueadas
          </span>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 px-3.5 py-2 text-[11px] text-indigo-200">
          En este modo nadie puede ver fotos ni perfiles. Conecta primero por tu carrera, gustos y conversación antes de verse en persona en el campus.
        </div>
      </div>

      {/* Card Deck or Empty state */}
      <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center min-h-[580px]">
        {activeCardUser ? (
          <BlindCard
            key={activeCardUser.id}
            user={activeCardUser}
            onLike={() => handleSwipe(activeCardUser.id, 'like', 'blind')}
            onPass={() => handleSwipe(activeCardUser.id, 'pass', 'blind')}
            onSuperlike={() => handleSwipe(activeCardUser.id, 'superlike', 'blind')}
          />
        ) : (
          <div className="w-full h-[500px] rounded-3xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center p-8 text-center text-slate-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
              <EyeOff className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              No hay más citas a ciegas pendientes
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Has revisado todos los perfiles anónimos de hoy. Puedes reiniciar la lista para ver nuevos candidatos.
            </p>

            <button
              onClick={() => resetSwipes('blind')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-950/50 hover:bg-indigo-500 transition active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reiniciar Citas a Ciegas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
