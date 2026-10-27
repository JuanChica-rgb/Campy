import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentCard } from './StudentCard';
import { ProfileModal } from './ProfileModal';
import { ReportSheet } from './ReportSheet';
import { DeckEmpty } from './DeckEmpty';
import { PlusSheet } from './PlusSheet';
import { hasPlus } from '../lib/plus';
import { showSwipeAd } from '../lib/googleAds';
import type { User } from '../types';

const AD_EVERY = 5;

export const TraditionalMatchView: React.FC = () => {
  const {
    currentUser,
    users,
    swipedUserIds,
    handleSwipe,
    rewindLastPass,
    resetSwipes,
    selectedProfileUser,
    setSelectedProfileUser,
    discovery,
    outreach,
    sendSuperLike,
    sendNote,
    setCurrentTab,
    openChat,
    isBlocked
  } = useApp();

  const [plusOpen, setPlusOpen] = useState(false);
  const [plusHighlight, setPlusHighlight] = useState<'superlike' | 'note' | 'rewind'>('superlike');
  const [noteTarget, setNoteTarget] = useState<User | null>(null);
  const [noteBody, setNoteBody] = useState('');
  const [noteError, setNoteError] = useState('');
  const [adCount, setAdCount] = useState(0);
  const [reportTarget, setReportTarget] = useState<User | null>(null);

  const matchesPrefs = (user: User) => {
    if (user.age < discovery.ageMin || user.age > discovery.ageMax) return false;
    if (discovery.interestIn === 'mujeres' && user.gender && user.gender !== 'mujer') return false;
    if (discovery.interestIn === 'hombres' && user.gender && user.gender !== 'hombre') return false;
    return true;
  };

  const pool = users.filter(user => {
    if (user.id === currentUser.id) return false;
    if (user.verificationStatus !== 'approved') return false;
    if (user.role === 'admin') return false;
    if (isBlocked(user.id)) return false;
    if (user.privateProfile) return false;
    if (swipedUserIds.has(user.id)) return false;
    return true;
  });
  const activeCardUser = pool.find(matchesPrefs);
  const filteredOutByPrefs = !activeCardUser && pool.length > 0;

  const plus = hasPlus(currentUser);

  const openPlus = (feature: 'superlike' | 'note' | 'rewind' = 'superlike') => {
    setPlusHighlight(feature);
    setPlusOpen(true);
  };

  const swipe = (userId: string, action: 'like' | 'pass') => {
    handleSwipe(userId, action, 'traditional');
    setAdCount(count => {
      const next = count + 1;
      if (next >= AD_EVERY) {
        void showSwipeAd();
        return 0;
      }
      return next;
    });
  };

  const superLike = (target: User) => {
    if (!plus) {
      openPlus('superlike');
      return;
    }
    const existing = outreach.find(
      row => row.kind === 'superlike' && row.fromId === currentUser.id && row.toId === target.id
    );
    if (existing) {
      setCurrentTab('chats');
      openChat(existing.id, 'outreach');
      return;
    }
    void sendSuperLike(target.id).then(error => {
      if (!error) {
        swipe(target.id, 'pass');
        setCurrentTab('chats');
        openChat(`out_superlike_${currentUser.id}_${target.id}`, 'outreach');
      }
    });
  };

  const openNote = (target: User) => {
    if (!plus) {
      openPlus('note');
      return;
    }
    const existing = outreach.find(
      row => row.kind === 'note' && row.fromId === currentUser.id && row.toId === target.id
    );
    if (existing) {
      setCurrentTab('chats');
      openChat(existing.id, 'outreach');
      return;
    }
    setNoteBody('');
    setNoteError('');
    setNoteTarget(target);
  };

  const submitNote = async () => {
    if (!noteTarget) return;
    const error = await sendNote(noteTarget.id, noteBody);
    if (error) {
      setNoteError(error);
      return;
    }
    const id = `out_note_${currentUser.id}_${noteTarget.id}`;
    setNoteTarget(null);
    setCurrentTab('chats');
    openChat(id, 'outreach');
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[420px] flex-col px-3 py-2 md:max-w-[480px] md:py-6 lg:max-w-[520px]">
      {currentUser.privateProfile && (
        <p className="mb-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-center text-[11px] leading-relaxed text-rose-100">
          Tu perfil está privado: no harás match y nadie te verá. En grupos apareces como Anónimo.
        </p>
      )}
      {activeCardUser ? (
        <div className="flex min-h-0 flex-1 items-stretch justify-center">
          <StudentCard
            key={activeCardUser.id}
            user={activeCardUser}
            onRewind={() => {
              if (!plus) {
                openPlus('rewind');
                return;
              }
              rewindLastPass('traditional');
            }}
            onMessage={() => openNote(activeCardUser)}
            onLike={() => swipe(activeCardUser.id, 'like')}
            onPass={() => swipe(activeCardUser.id, 'pass')}
            onSuperlike={() => superLike(activeCardUser)}
            onReport={() => setReportTarget(activeCardUser)}
            onOpenDetails={() => setSelectedProfileUser(activeCardUser)}
          />
        </div>
      ) : (
        <DeckEmpty
          photoUrl={currentUser.photoUrl}
          hint={
            filteredOutByPrefs
              ? 'Hay perfiles, pero no coinciden con tus filtros. Abre el ícono de filtros arriba y cambia “Interesado en” o la edad.'
              : undefined
          }
          onReplay={() => resetSwipes('traditional')}
        />
      )}

      {plusOpen && <PlusSheet highlight={plusHighlight} onClose={() => setPlusOpen(false)} />}

      {noteTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-3 pb-[calc(1rem+var(--campy-safe-bottom))] sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-6 text-white">
            <h2 className="text-lg font-semibold">
              Un mensaje para {noteTarget.name.split(' ')[0]}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Solo puedes enviar uno. Si no quiere seguir, ahí queda.
            </p>
            <textarea
              value={noteBody}
              onChange={event => setNoteBody(event.target.value)}
              maxLength={280}
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none"
            />
            {noteError && <p className="mt-2 text-xs text-rose-300">{noteError}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setNoteTarget(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void submitNote()}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProfileUser && (
        <ProfileModal
          user={selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
          onReport={() => {
            const target = selectedProfileUser;
            setSelectedProfileUser(null);
            if (target) setReportTarget(target);
          }}
          onSuperlike={() => {
            const target = selectedProfileUser;
            setSelectedProfileUser(null);
            if (target) superLike(target);
          }}
        />
      )}

      {reportTarget && (
        <ReportSheet
          userId={reportTarget.id}
          userName={reportTarget.name}
          onClose={() => setReportTarget(null)}
        />
      )}
    </div>
  );
};
