import React, { useMemo, useRef, useState } from 'react';
import { User } from '../types';
import { Info, Heart, X, Star, RotateCcw, Send, Flag } from 'lucide-react';

function firstLine(bio: string) {
  const sentence = bio.split(/(?<=\.)\s/)[0] ?? bio;
  return sentence.length > 110 ? `${sentence.slice(0, 104).trim()}…` : sentence;
}

interface StudentCardProps {
  user: User;
  onLike: () => void;
  onPass: () => void;
  onSuperlike?: () => void;
  onRewind?: () => void;
  onMessage?: () => void;
  onReport?: () => void;
  paidSuperlike?: boolean;
  note?: string;
  onOpenDetails: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  user,
  onLike,
  onPass,
  onSuperlike,
  onRewind,
  onMessage,
  onReport,
  paidSuperlike,
  note,
  onOpenDetails
}) => {
  const photos = useMemo(
    () => [user.photoUrl, ...(user.additionalPhotos ?? [])].filter(Boolean),
    [user.photoUrl, user.additionalPhotos]
  );
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const locked = useRef(false);

  const activePhoto = photos[Math.min(photoIndex, Math.max(photos.length - 1, 0))] || user.photoUrl;
  const likeHint = Math.max(0, Math.min(1, dragX / 120));
  const passHint = Math.max(0, Math.min(1, -dragX / 120));

  const goPhoto = (dir: -1 | 1) => {
    setPhotoIndex(index => {
      const next = index + dir;
      if (next < 0 || next >= photos.length) return index;
      return next;
    });
  };

  const finishSwipe = (action: 'like' | 'pass') => {
    if (locked.current) return;
    locked.current = true;
    setDragX(action === 'like' ? 420 : -420);
    window.setTimeout(() => {
      if (action === 'like') onLike();
      else onPass();
      locked.current = false;
      setDragX(0);
      setDragging(false);
      setPhotoIndex(0);
    }, 180);
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('[data-card-action]')) return;
    startX.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(event.clientX - startX.current);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const delta = event.clientX - startX.current;
    if (delta > 110) finishSwipe('like');
    else if (delta < -110) finishSwipe('pass');
    else setDragX(0);
  };

  const onPhotoTap = (event: React.MouseEvent) => {
    if (Math.abs(dragX) > 8) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    if (x < bounds.width * 0.35) goPhoto(-1);
    else if (x > bounds.width * 0.65) goPhoto(1);
  };

  return (
    <div
      className="campy-card-in relative flex h-full min-h-0 w-full flex-col touch-none select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-800 shadow-[0_28px_50px_-18px_rgba(0,0,0,0.72)] md:rounded-[2rem]"
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 28}deg)`,
        transition: dragging ? 'none' : 'transform 180ms ease-out'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        setDragging(false);
        setDragX(0);
      }}
    >
      <div
        className="absolute inset-0 z-0"
        onClick={onPhotoTap}
        role="presentation"
      >
        <img
          src={activePhoto}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

      <div
        className="pointer-events-none absolute inset-0 bg-[#F43F5E]/70"
        style={{ opacity: likeHint * 0.55 }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-sky-500/70"
        style={{ opacity: passHint * 0.55 }}
      />

      {photos.length > 1 && (
        <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
          {photos.map((_, index) => (
            <span
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index === photoIndex ? 'bg-white' : 'bg-white/35'
              }`}
            />
          ))}
        </div>
      )}

      <div
        className="pointer-events-none absolute left-5 top-16 z-20 rounded-lg border-4 border-[#F43F5E] px-3 py-1 text-xl font-black tracking-wide text-[#F43F5E] rotate-[-12deg]"
        style={{ opacity: likeHint }}
      >
        LIKE
      </div>
      <div
        className="pointer-events-none absolute right-5 top-16 z-20 rounded-lg border-4 border-sky-400 px-3 py-1 text-xl font-black tracking-wide text-sky-300 rotate-[12deg]"
        style={{ opacity: passHint }}
      >
        NOPE
      </div>

      <div className="absolute top-10 left-3 right-3 z-20 flex items-center justify-between">
        {onReport ? (
          <button
            type="button"
            data-card-action
            onClick={onReport}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur-md"
            title="Denunciar"
            aria-label="Denunciar"
          >
            <Flag className="h-4 w-4" />
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          data-card-action
          onClick={onOpenDetails}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur-md"
          title="Ver perfil completo"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-[4.6rem] z-20 p-4 text-white sm:bottom-[5.1rem]">
        <div className="flex items-baseline gap-1.5">
          <h2 className="truncate text-xl font-semibold font-display tracking-tight text-slate-100 sm:text-2xl">
            {user.name}
          </h2>
          <span className="text-sm font-medium text-slate-300 sm:text-base">{user.age}</span>
        </div>
        {(user.gender || user.interestIn) && (
          <p className="mt-0.5 truncate text-[12px] font-medium text-rose-200">
            {user.gender === 'mujer' ? 'Mujer' : user.gender === 'hombre' ? 'Hombre' : ''}
            {user.interestIn
              ? `${user.gender ? ' · ' : ''}Interesado en ${
                  user.interestIn === 'mujeres'
                    ? 'mujeres'
                    : user.interestIn === 'hombres'
                      ? 'hombres'
                      : 'ambos'
                }`
              : ''}
          </p>
        )}
        <p className="mt-1 truncate text-[13px] font-semibold text-slate-200">{user.career}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          {user.semester}º semestre · {user.university}
        </p>
        {note && <p className="mt-1 truncate text-[12px] font-medium text-blue-300">{note}</p>}
        <p className="mt-2 hidden text-[12px] leading-snug text-slate-300 line-clamp-2 [@media(min-height:700px)]:block">
          {firstLine(user.bio)}
        </p>
        <div className="mt-2 hidden flex-wrap gap-1.5 [@media(min-height:700px)]:flex">
          {user.interests.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-3 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-6">
        {onRewind && (
          <button
            type="button"
            data-card-action
            onClick={onRewind}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 sm:h-11 sm:w-11"
            title="Devolver, de pago"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 rounded-full bg-blue-500 px-1 text-[8px] font-bold text-white">
              Plus
            </span>
          </button>
        )}
        <button
          type="button"
          data-card-action
          onClick={() => finishSwipe('pass')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-300/40 bg-slate-900/80 text-slate-200 sm:h-12 sm:w-12"
          title="Pasar"
        >
          <X className="h-6 w-6" />
        </button>
        {onSuperlike && (
          <button
            type="button"
            data-card-action
            onClick={onSuperlike}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/50 bg-slate-900/50 text-blue-300 sm:h-11 sm:w-11"
            title={paidSuperlike ? 'Super Like, de pago' : 'Superlike'}
          >
            <Star className="h-5 w-5" />
            {paidSuperlike && (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-500 px-1 text-[8px] font-bold text-white">
                Plus
              </span>
            )}
          </button>
        )}
        <button
          type="button"
          data-card-action
          onClick={() => finishSwipe('like')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F43F5E] text-white shadow-lg sm:h-14 sm:w-14"
          title="Me Gusta"
        >
          <Heart className="h-7 w-7 fill-white" />
        </button>
        {onMessage && (
          <button
            type="button"
            data-card-action
            onClick={onMessage}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 sm:h-11 sm:w-11"
            title="Mensaje, de pago"
            aria-label="Mensaje"
          >
            <Send className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
