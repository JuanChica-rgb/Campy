import React from 'react';
import { User } from '../types';
import { ShieldCheck, Info, Heart, X, Star, Sparkles, GraduationCap, MapPin } from 'lucide-react';

interface StudentCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onSuperlike: () => void;
  onOpenDetails: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  user,
  onLike,
  onPass,
  onSuperlike,
  onOpenDetails
}) => {
  return (
    <div className="relative w-full max-w-sm sm:max-w-md h-[560px] sm:h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700/80 select-none transition-all duration-300">
      {/* Background Image */}
      <img
        src={user.photoUrl}
        alt={user.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Dark overlay gradients for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20 pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="flex items-center gap-1.5 rounded-full bg-slate-950/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verificado UNAM / Campus</span>
        </span>

        <button
          onClick={onOpenDetails}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md text-white border border-white/20 hover:bg-slate-900 transition"
          title="Ver perfil completo"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10 flex flex-col justify-end">
        {/* Name, Age and Career */}
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            {user.name}
          </h2>
          <span className="text-xl sm:text-2xl font-light text-slate-300">
            {user.age}
          </span>
        </div>

        {/* Academic Details */}
        <div className="flex items-center gap-2 text-xs font-medium text-rose-300 mt-1">
          <GraduationCap className="h-4 w-4 shrink-0 text-rose-400" />
          <span className="truncate">{user.career}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-200">{user.semester}º semestre</span>
        </div>

        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {user.university}
        </p>

        {/* Bio preview */}
        <p className="text-xs text-slate-200 line-clamp-2 mt-2 leading-relaxed">
          {user.bio}
        </p>

        {/* Interests preview */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {user.interests.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
          {user.interests.length > 4 && (
            <span className="rounded-md bg-slate-900/60 px-1.5 py-0.5 text-[11px] text-slate-400">
              +{user.interests.length - 4}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-5 mt-5 pt-3 border-t border-white/10">
          {/* Dislike / Pass */}
          <button
            onClick={onPass}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/90 text-rose-400 border border-rose-500/30 shadow-lg shadow-black/40 hover:bg-rose-500 hover:text-white hover:scale-105 active:scale-95 transition"
            title="Pasar"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Superlike */}
          <button
            onClick={onSuperlike}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/30 shadow-lg shadow-black/40 hover:bg-amber-500 hover:text-slate-950 hover:scale-105 active:scale-95 transition"
            title="Superlike Universitario"
          >
            <Star className="h-6 w-6 fill-current" />
          </button>

          {/* Like */}
          <button
            onClick={onLike}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xl shadow-rose-950/60 hover:from-rose-600 hover:to-rose-700 hover:scale-105 active:scale-95 transition"
            title="Me Gusta"
          >
            <Heart className="h-7 w-7 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
