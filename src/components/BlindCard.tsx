import React from 'react';
import { User } from '../types';
import { Heart, X, Star, Flag } from 'lucide-react';

interface BlindCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onSuperlike: () => void;
  onReport?: () => void;
}

function firstLine(text: string) {
  const sentence = text.split(/(?<=\.)\s/)[0] ?? text;
  return sentence.length > 140 ? `${sentence.slice(0, 134).trim()}…` : sentence;
}

export const BlindCard: React.FC<BlindCardProps> = ({
  user,
  onLike,
  onPass,
  onSuperlike,
  onReport
}) => {
  const line = user.blindBio ? firstLine(user.blindBio) : firstLine(user.bio);

  return (
    <div className="campy-card-in relative flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-[0_28px_50px_-18px_rgba(0,0,0,0.72)] select-none">
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <h2 className="truncate text-xl font-semibold font-display tracking-tight text-slate-100">{user.name}</h2>
            <span className="text-sm font-medium text-slate-400">{user.age}</span>
          </div>
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 hover:border-rose-400/40 hover:text-rose-300"
              title="Denunciar"
              aria-label="Denunciar"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1 truncate text-[13px] font-semibold text-slate-200">{user.career}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.university}</p>

        <p className="mt-4 text-[13px] leading-snug text-slate-300">{line}</p>
        {user.blindIdealSpot && (
          <p className="mt-2 text-[12px] text-slate-400">{user.blindIdealSpot}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {user.interests.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-4 border-t border-white/10 px-4 py-3">
        <button
          onClick={onPass}
          className="flex h-11 w-11 items-center justify-center rounded-[1.15rem_1.4rem_1.2rem_1.05rem] border border-blue-300/25 bg-slate-900/80 text-slate-300 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-300/60 hover:text-white active:translate-y-0 active:scale-95"
          title="Pasar perfil anónimo"
        >
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={onSuperlike}
          className="flex h-10 w-10 items-center justify-center rounded-[1.35rem_1.05rem_1.25rem_1.15rem] border border-blue-400/50 bg-slate-900/50 text-blue-300 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-500 hover:text-white active:translate-y-0 active:scale-95"
          title="Cita a ciegas prioritaria"
        >
          <Star className="h-5 w-5" />
        </button>
        <button
          onClick={onLike}
          className="flex h-11 w-11 items-center justify-center rounded-[1.05rem_1.35rem_1.15rem_1.4rem] bg-[#F43F5E] text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#E11D48] active:translate-y-0 active:scale-95"
          title="Conectar a ciegas"
        >
          <Heart className="h-5 w-5 fill-white" />
        </button>
      </div>
    </div>
  );
};
