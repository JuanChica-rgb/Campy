import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfileModal } from './ProfileModal';
import { PlusSheet } from './PlusSheet';
import { Heart, Lock } from 'lucide-react';
import { User } from '../types';
import { hasPlus } from '../lib/plus';

export const LikesView: React.FC = () => {
  const { currentUser, users, matches, incomingLikes, respondToLike, isBlocked } = useApp();
  const [openUser, setOpenUser] = useState<User | null>(null);
  const [plusOpen, setPlusOpen] = useState(false);
  const plus = hasPlus(currentUser);

  const likedYou = (incomingLikes[currentUser.id] ?? [])
    .map(id => users.find(user => user.id === id))
    .filter((user): user is User => {
      if (!user) return false;
      if (user.verificationStatus !== 'approved' || user.role === 'admin') return false;
      if (user.privateProfile) return false;
      if (isBlocked(user.id)) return false;
      return !matches.some(
        match =>
          (match.user1Id === currentUser.id && match.user2Id === user.id) ||
          (match.user2Id === currentUser.id && match.user1Id === user.id)
      );
    });

  return (
    <div className="mx-auto h-full w-full max-w-lg overflow-y-auto px-4 py-4 md:max-w-3xl md:py-8">
      {!plus && likedYou.length > 0 && (
        <button
          type="button"
          onClick={() => setPlusOpen(true)}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-left"
        >
          <Lock className="h-5 w-5 shrink-0 text-rose-300" />
          <span>
            <span className="block text-sm font-semibold text-white">
              {likedYou.length} {likedYou.length === 1 ? 'persona te dio like' : 'personas te dieron like'}
            </span>
            <span className="block text-xs text-rose-200/80">Con Plus ves quiénes son y decides.</span>
          </span>
        </button>
      )}

      {likedYou.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <Heart className="mb-3 h-8 w-8 text-[#F43F5E]" />
          <h2 className="text-lg font-semibold text-white">Nadie te ha dado like todavía</h2>
          <p className="mt-1 max-w-xs text-sm text-slate-400">
            Cuando alguien te dé like, aparece aquí. Ver quiénes son es de Campy Plus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {likedYou.map(person => (
            <button
              key={person.id}
              type="button"
              onClick={() => {
                if (!plus) {
                  setPlusOpen(true);
                  return;
                }
                setOpenUser(person);
              }}
              className="overflow-hidden rounded-3xl text-left"
            >
              <div className="relative h-64">
                <img
                  src={person.photoUrl}
                  alt=""
                  className={`h-full w-full object-cover ${plus ? '' : 'scale-110 blur-xl'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {!plus && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
                      <Lock className="h-5 w-5" />
                    </span>
                  </div>
                )}
                <p className="absolute bottom-3 left-3 right-3 text-base font-semibold text-white">
                  {plus ? (
                    <>
                      {person.name.split(' ')[0]}{' '}
                      <span className="text-sm font-medium text-white/80">{person.age}</span>
                    </>
                  ) : (
                    <span className="text-sm text-white/80">Plus para ver</span>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {openUser && plus && (
        <ProfileModal
          user={openUser}
          onClose={() => setOpenUser(null)}
          onPass={() => respondToLike(openUser.id, 'pass')}
          onLike={() => respondToLike(openUser.id, 'match')}
        />
      )}

      {plusOpen && <PlusSheet highlight="likes" onClose={() => setPlusOpen(false)} />}
    </div>
  );
};
