import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BlindCard } from './BlindCard';
import { ReportSheet } from './ReportSheet';
import { DeckEmpty } from './DeckEmpty';
import { PlusSheet } from './PlusSheet';
import { hasPlus } from '../lib/plus';
import { showSwipeAd } from '../lib/googleAds';
import type { User } from '../types';

const AD_EVERY = 5;

export const BlindDatingView: React.FC = () => {
  const {
    currentUser,
    users,
    blindSwipedUserIds,
    handleSwipe,
    setCurrentTab,
    isBlocked,
    discovery,
    sendSuperLike,
    openChat
  } = useApp();
  const [plusOpen, setPlusOpen] = useState(false);
  const [adCount, setAdCount] = useState(0);
  const [reportTarget, setReportTarget] = useState<User | null>(null);

  const activeCardUser = users.find(user => {
    if (user.id === currentUser.id) return false;
    if (user.verificationStatus !== 'approved') return false;
    if (user.role === 'admin') return false;
    if (isBlocked(user.id)) return false;
    if (user.privateProfile) return false;
    if (blindSwipedUserIds.has(user.id)) return false;
    if (discovery.interestIn === 'mujeres' && user.gender && user.gender !== 'mujer') return false;
    if (discovery.interestIn === 'hombres' && user.gender && user.gender !== 'hombre') return false;
    return true;
  });

  const swipe = (userId: string, action: 'like' | 'pass') => {
    handleSwipe(userId, action, 'blind');
    setAdCount(count => {
      const next = count + 1;
      if (next >= AD_EVERY) {
        void showSwipeAd();
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[420px] flex-col items-center justify-center px-3 md:max-w-lg md:py-6">
      <div className="flex h-full w-full min-h-0 items-center justify-center">
        {activeCardUser ? (
          <BlindCard
            key={activeCardUser.id}
            user={activeCardUser}
            onLike={() => swipe(activeCardUser.id, 'like')}
            onPass={() => swipe(activeCardUser.id, 'pass')}
            onSuperlike={() => {
              if (!hasPlus(currentUser)) {
                setPlusOpen(true);
                return;
              }
              void sendSuperLike(activeCardUser.id).then(error => {
                if (!error) {
                  swipe(activeCardUser.id, 'pass');
                  setCurrentTab('chats');
                  openChat(`out_superlike_${currentUser.id}_${activeCardUser.id}`, 'outreach');
                }
              });
            }}
            onReport={() => setReportTarget(activeCardUser)}
          />
        ) : (
          <DeckEmpty
            photoUrl={currentUser.photoUrl}
            modeName="Ciegas"
            onGoHome={() => setCurrentTab('traditional')}
          />
        )}
      </div>
      {plusOpen && <PlusSheet highlight="superlike" onClose={() => setPlusOpen(false)} />}
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
