import React from 'react';
import { User } from '../types';
import { X, GraduationCap, BookOpen, Sparkles, MapPin, ShieldCheck, Heart, Star, Phone } from 'lucide-react';

interface ProfileModalProps {
  user: User | null;
  onClose: () => void;
  onLike?: (userId: string) => void;
  onSuperlike?: (userId: string) => void;
  onPass?: (userId: string) => void;
  isBlindMode?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onLike,
  onSuperlike,
  onPass,
  isBlindMode = false
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white transition backdrop-blur-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media or Blind Banner */}
        {isBlindMode ? (
          <div className="h-44 w-full bg-gradient-to-br from-indigo-950 via-slate-800 to-rose-950 flex flex-col items-center justify-center p-6 text-center border-b border-slate-700">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-rose-400 border border-slate-700 shadow-inner mb-3">
              <Sparkles className="h-7 w-7" />
            </span>
            <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold">
              Perfil Anónimo · Cita a Ciegas
            </span>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              La fotografía se mantiene privada para conectar por intereses, carrera y personalidad.
            </p>
          </div>
        ) : (
          <div className="relative h-80 w-full overflow-hidden bg-slate-800">
            <img
              src={user.photoUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-display text-white">
                  {user.name}, {user.age}
                </h2>
                {user.verificationStatus === 'approved' && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Estudiante Verificado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                <span>{user.university}</span>
                <span aria-hidden="true">·</span>
                <span>{user.career}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {isBlindMode && (
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                {user.name}, {user.age} años
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.university} · {user.career} ({user.semester}º semestre)
              </p>
            </div>
          )}

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Carrera</p>
                <p className="text-xs font-semibold text-white truncate max-w-[170px]">{user.career}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Semestre</p>
                <p className="text-xs font-semibold text-white">{user.semester}º Semestre</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sobre mí</h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {user.bio}
            </p>
          </div>

          {/* Blind Date Vibe Prompt */}
          {user.blindBio && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Vibe para Cita en Campus
              </h3>
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 space-y-2">
                <p className="text-xs text-rose-200 italic">"{user.blindBio}"</p>
                {user.blindIdealSpot && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1 border-t border-rose-500/20">
                    <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Lugar favorito en campus: <strong>{user.blindIdealSpot}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Intereses & Gustos</h3>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {user.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 border border-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Campus verification pledge */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-start gap-3 text-xs text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-200">Garantía Campy Campus Seguro</p>
              <p className="text-emerald-400/80 text-[11px] mt-0.5">
                Este perfil fue auditado por el equipo de moderación mediante comprobante universitario vigente.
              </p>
            </div>
          </div>

          {/* Quick Actions if triggered inside card deck */}
          {(onLike || onPass || onSuperlike) && (
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-800">
              {onPass && (
                <button
                  onClick={() => {
                    onPass(user.id);
                    onClose();
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-rose-400 hover:bg-slate-700 hover:scale-105 transition"
                  title="Pasar"
                >
                  <X className="h-6 w-6" />
                </button>
              )}

              {onSuperlike && (
                <button
                  onClick={() => {
                    onSuperlike(user.id);
                    onClose();
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 hover:scale-105 transition"
                  title="Superlike"
                >
                  <Star className="h-6 w-6 fill-amber-400/30" />
                </button>
              )}

              {onLike && (
                <button
                  onClick={() => {
                    onLike(user.id);
                    onClose();
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-900/50 hover:bg-rose-600 hover:scale-105 transition"
                  title="Me Gusta"
                >
                  <Heart className="h-7 w-7 fill-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
