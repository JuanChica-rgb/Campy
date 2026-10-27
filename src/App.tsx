import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { TraditionalMatchView } from './components/TraditionalMatchView';
import { BlindDatingView } from './components/BlindDatingView';
import { GroupsView } from './components/GroupsView';
import { LikesView } from './components/LikesView';
import { MessagesHub } from './components/MessagesHub';
import { AdminPanel } from './components/AdminPanel';
import { PendingVerificationView } from './components/PendingVerificationView';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ProfileView } from './components/ProfileView';
import { AuthScreen } from './components/AuthScreen';
import { LandingPage } from './components/LandingPage';
import { WebAppFrame } from './components/WebAppFrame';
import { enterWebApp, wantsWebApp } from './lib/webApp';
import { ShieldAlert } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, currentTab, authReady, sessionUserId, users, remoteReady } = useApp();

  if (!authReady || (sessionUserId && !remoteReady)) {
    return (
      <div className="grid h-full min-h-full place-items-center bg-slate-950 text-sm text-slate-400">
        Cargando Campy…
      </div>
    );
  }

  if (!sessionUserId) {
    return <AuthScreen />;
  }

  const me = users.find(user => user.id === sessionUserId) ?? currentUser;
  if (!me || me.id !== sessionUserId) {
    return <AuthScreen />;
  }

  if (me.verificationStatus === 'banned') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-white">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-8 shadow-2xl">
          <ShieldAlert className="mx-auto mb-3 h-12 w-12 text-rose-500" />
          <h2 className="font-display text-xl font-bold text-white">Cuenta bloqueada</h2>
          <p className="mt-2 text-xs leading-relaxed text-rose-200">
            Esta cuenta fue bloqueada por el equipo de moderación de Campy. Ya no puedes usar la app.
          </p>
        </div>
      </div>
    );
  }

  if (me.verificationStatus === 'pending' || me.verificationStatus === 'rejected') {
    return (
      <div className="h-full min-h-full bg-black">
        <PendingVerificationView />
      </div>
    );
  }

  switch (currentTab) {
    case 'traditional':
      return <TraditionalMatchView />;
    case 'blind':
      return <BlindDatingView />;
    case 'groups':
      return <GroupsView />;
    case 'likes':
      return <LikesView />;
    case 'chats':
      return <MessagesHub />;
    case 'profile':
      return <ProfileView />;
    case 'admin':
      return <AdminPanel />;
    default:
      return <TraditionalMatchView />;
  }
};

export default function App() {
  const Shell: React.FC = () => {
    const { authReady, sessionUserId, currentUser, setIsRegisterOpen } = useApp();
    const [webAppOpen, setWebAppOpen] = useState(() => wantsWebApp());
    const loggedIn = !!sessionUserId;
    const showLanding = authReady && !loggedIn && !webAppOpen;

    useEffect(() => {
      const close = () => setWebAppOpen(false);
      const onHash = () => {
        if (window.location.hash === '#app') setWebAppOpen(true);
        else if (!sessionUserId) setWebAppOpen(false);
      };
      window.addEventListener('campy-open-landing', close);
      window.addEventListener('hashchange', onHash);
      return () => {
        window.removeEventListener('campy-open-landing', close);
        window.removeEventListener('hashchange', onHash);
      };
    }, [sessionUserId]);
    const approved =
      authReady &&
      !!sessionUserId &&
      currentUser.id === sessionUserId &&
      currentUser.verificationStatus === 'approved';

    if (showLanding) {
      return (
        <LandingPage
          onEnter={register => {
            enterWebApp();
            setWebAppOpen(true);
            if (register) setIsRegisterOpen(true);
          }}
        />
      );
    }

    const shell = (
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-black font-sans text-slate-100 selection:bg-rose-500 selection:text-white">
        <main
          className={
            approved
              ? 'relative min-h-0 flex-1 overflow-hidden pb-[calc(5.35rem+var(--campy-safe-bottom))] md:pb-0'
              : 'relative min-h-0 flex-1 overflow-hidden'
          }
        >
          <MainContent />
        </main>
        {approved && <MatchCelebrationModal />}
      </div>
    );

    return (
      <WebAppFrame showBack={!loggedIn} onBack={() => setWebAppOpen(false)}>
        {approved ? <Navbar>{shell}</Navbar> : shell}
      </WebAppFrame>
    );
  };

  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
