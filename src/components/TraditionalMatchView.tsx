import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentCard } from './StudentCard';
import { ProfileModal } from './ProfileModal';
import { Flame, RefreshCw, Sparkles, Filter, ShieldCheck, MapPin } from 'lucide-react';
import { User } from '../types';

export const TraditionalMatchView: React.FC = () => {
  const {
    currentUser,
    users,
    swipedUserIds,
    handleSwipe,
    resetSwipes,
    selectedProfileUser,
    setSelectedProfileUser
  } = useApp();

  const [careerFilter, setCareerFilter] = useState<string>('all');

  // Filter candidates: only approved, not current user, not swiped in this session
  const candidateUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    if (user.verificationStatus !== 'approved') return false;
    if (user.role === 'admin') return false;
    if (swipedUserIds.has(user.id)) return false;
    if (careerFilter !== 'all' && !user.career.toLowerCase().includes(careerFilter.toLowerCase())) return false;
    return true;
  });

  const activeCardUser = candidateUsers[0];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Subheader with filter */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="h-4 w-4 fill-rose-500" />
          </span>
          <h1 className="text-base font-bold text-white font-display">Match Universitario</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={careerFilter}
            onChange={e => setCareerFilter(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="all">Todas las facultades</option>
            <option value="medicina">Medicina / Salud</option>
            <option value="ing">Ingeniería / IA</option>
            <option value="diseño">Diseño / Arte</option>
            <option value="psicología">Psicología / Humanidades</option>
            <option value="arquitectura">Arquitectura</option>
          </select>
        </div>
      </div>

      {/* Card Deck or Empty State */}
      <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center min-h-[580px]">
        {activeCardUser ? (
          <div className="w-full flex justify-center">
            <StudentCard
              key={activeCardUser.id}
              user={activeCardUser}
              onLike={() => handleSwipe(activeCardUser.id, 'like', 'traditional')}
              onPass={() => handleSwipe(activeCardUser.id, 'pass', 'traditional')}
              onSuperlike={() => handleSwipe(activeCardUser.id, 'superlike', 'traditional')}
              onOpenDetails={() => setSelectedProfileUser(activeCardUser)}
            />
          </div>
        ) : (
          <div className="w-full h-[500px] rounded-3xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center p-8 text-center text-slate-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              ¡Has visto a todos por ahora!
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Ya exploraste a los estudiantes disponibles de tu facultad o campus. Vuelve a mezclar los perfiles para seguir conectando.
            </p>

            <button
              onClick={() => resetSwipes('traditional')}
              className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-600 transition active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Recargar Estudiantes de Campus</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Details Modal if opened */}
      {selectedProfileUser && (
        <ProfileModal
          user={selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
          onLike={id => {
            handleSwipe(id, 'like', 'traditional');
            setSelectedProfileUser(null);
          }}
          onSuperlike={id => {
            handleSwipe(id, 'superlike', 'traditional');
            setSelectedProfileUser(null);
          }}
          onPass={id => {
            handleSwipe(id, 'pass', 'traditional');
            setSelectedProfileUser(null);
          }}
        />
      )}
    </div>
  );
};
