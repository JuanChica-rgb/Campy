import React from 'react';
import { User } from '../types';
import { Shield, Sparkles, Heart, X, Star, GraduationCap, MapPin, Lock, BookOpen } from 'lucide-react';

interface BlindCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onSuperlike: () => void;
}

export const BlindCard: React.FC<BlindCardProps> = ({
  user,
  onLike,
  onPass,
  onSuperlike
}) => {
  return (
    <div className="relative w-full max-w-sm sm:max-w-md min-h-[580px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/70 border border-indigo-900/40 p-6 flex flex-col justify-between text-white select-none">
      {/* Decorative neutral header & lock badge */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Lock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">Cita a Ciegas</p>
              <p className="text-[10px] text-slate-400">Fotografía oculta por seguridad y anonimato</p>
            </div>
          </div>

          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 border border-slate-700">
            {user.semester}º Semestre
          </span>
        </div>

        {/* Abstract Privacy Graphic Banner (no photo) */}
        <div className="my-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-rose-500/5 to-transparent pointer-events-none" />
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 shadow-inner mb-3">
            <Sparkles className="h-9 w-9" />
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold font-display text-white">{user.name}</h2>
            <span className="text-xl font-light text-slate-300">{user.age} años</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-indigo-300 mt-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{user.career}</span>
          </div>

          <p className="text-[11px] text-slate-400 mt-0.5">{user.university}</p>
        </div>

        {/* Short Bio */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Personalidad & Lo que busca
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800/80">
            {user.bio}
          </p>
        </div>

        {/* Blind prompt answers */}
        {user.blindBio && (
          <div className="mt-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs">
            <p className="font-semibold text-indigo-300 mb-0.5 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Pregunta rompehielos:</span>
            </p>
            <p className="text-slate-300 italic">"{user.blindBio}"</p>
            {user.blindIdealSpot && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 pt-1.5 border-t border-indigo-500/20">
                <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
                <span>Spot favorito en campus: <strong className="text-slate-200">{user.blindIdealSpot}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Interests & Tags */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Gustos en común
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-xs font-medium text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-5 pt-4 mt-4 border-t border-slate-800">
        {/* Pass */}
        <button
          onClick={onPass}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/90 text-rose-400 border border-rose-500/30 shadow-lg shadow-black/40 hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95 transition"
          title="Pasar perfil anónimo"
        >
          <X className="h-7 w-7" />
        </button>

        {/* Superlike */}
        <button
          onClick={onSuperlike}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/90 text-amber-400 border border-amber-500/30 shadow-lg shadow-black/40 hover:bg-amber-500 hover:text-slate-950 hover:scale-105 active:scale-95 transition"
          title="Cita a Ciegas Prioritaria"
        >
          <Star className="h-6 w-6 fill-current" />
        </button>

        {/* Like */}
        <button
          onClick={onLike}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-xl shadow-indigo-950/60 hover:from-indigo-600 hover:to-indigo-700 hover:scale-105 active:scale-95 transition"
          title="Conectar a Ciegas"
        >
          <Heart className="h-7 w-7 fill-white" />
        </button>
      </div>
    </div>
  );
};
