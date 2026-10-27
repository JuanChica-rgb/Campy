import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, MessageCircle, Heart, Shield, ArrowRight } from 'lucide-react';

export const MatchCelebrationModal: React.FC = () => {
  const { matchCelebration, closeMatchCelebration, currentUser, openChat, matches } = useApp();

  if (!matchCelebration.isOpen || !matchCelebration.user) return null;

  const matchedUser = matchCelebration.user;
  const isBlind = matchCelebration.type === 'blind';

  // Find match id
  const currentMatch = matches.find(
    m =>
      (m.user1Id === currentUser.id && m.user2Id === matchedUser.id) ||
      (m.user2Id === currentUser.id && m.user1Id === matchedUser.id)
  );

  const handleStartChat = () => {
    if (currentMatch) {
      openChat(currentMatch.id, isBlind ? 'blind' : 'traditional');
    }
    closeMatchCelebration();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 text-center text-white shadow-2xl overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isBlind ? '¡Cita a Ciegas Conectada!' : '¡Es un Match Universitario!'}</span>
          </div>

          <h2 className="text-3xl font-extrabold font-display tracking-tight text-white mb-1">
            {isBlind ? 'Conexión a Ciegas' : '¡Hicieron Match!'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xs mb-6">
            {isBlind
              ? `Tú y ${matchedUser.name} hicieron match en modo cita a ciegas. Ambos coinciden en gustos e intereses universitarios.`
              : `Tú y ${matchedUser.name} se han gustado mutuamente. Es hora de romper el hielo en el campus.`}
          </p>

          {/* Avatars Collision */}
          <div className="relative flex items-center justify-center mb-6">
            {/* User 1 avatar */}
            <div className="relative h-24 w-24 rounded-full ring-4 ring-slate-900 overflow-hidden shadow-xl z-10">
              {isBlind ? (
                <div className="h-full w-full bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center text-xs font-bold text-slate-300">
                  Tú
                </div>
              ) : (
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Heart in between */}
            <div className="absolute z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#F43F5E] text-white shadow-lg ring-4 ring-slate-900">
              <Heart className="h-5 w-5 fill-white" />
            </div>

            {/* User 2 avatar */}
            <div className="relative -ml-6 h-24 w-24 rounded-full ring-4 ring-slate-900 overflow-hidden shadow-xl z-20">
              {isBlind ? (
                <div className="h-full w-full bg-gradient-to-br from-indigo-900 to-rose-950 flex flex-col items-center justify-center p-2 text-center">
                  <Shield className="h-6 w-6 text-rose-400 mb-1" />
                  <span className="text-[10px] font-semibold text-rose-200 truncate max-w-[70px]">
                    {matchedUser.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <img
                  src={matchedUser.photoUrl}
                  alt={matchedUser.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Info pill */}
          <div className="w-full rounded-2xl bg-slate-800/80 border border-slate-700/60 p-3 mb-6 text-xs text-slate-300">
            <p className="font-semibold text-white">
              {matchedUser.name} · {matchedUser.age} años
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {matchedUser.university} · {matchedUser.career}
            </p>
          </div>

          {/* Actions */}
          <div className="w-full space-y-2.5">
            <button
              onClick={handleStartChat}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/60 hover:from-rose-600 hover:to-rose-700 transition active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enviar Mensaje Ahora</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>

            <button
              onClick={closeMatchCelebration}
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Seguir Explorando Campus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
