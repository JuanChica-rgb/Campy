import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { TraditionalMatchView } from './components/TraditionalMatchView';
import { BlindDatingView } from './components/BlindDatingView';
import { GroupsView } from './components/GroupsView';
import { MessagesHub } from './components/MessagesHub';
import { AdminPanel } from './components/AdminPanel';
import { PendingVerificationView } from './components/PendingVerificationView';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { RegisterModal } from './components/RegisterModal';
import { UserSwitcherModal } from './components/UserSwitcherModal';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUser, currentTab, setCurrentTab, resetToDefaults } = useApp();

  // If user is banned
  if (currentUser.verificationStatus === 'banned') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-white">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-8 shadow-2xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold font-display text-white">Cuenta Suspendida</h2>
          <p className="text-xs text-rose-200 mt-2 leading-relaxed">
            Esta cuenta fue suspendida por el comité de moderación de Campy debido al incumplimiento de las normas de convivencia o documentación no auténtica.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={resetToDefaults}
              className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Restaurar Cuentas de Prueba
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is pending verification and is not explicitly in the Admin tab
  if (currentUser.verificationStatus === 'pending' && currentTab !== 'admin') {
    return <PendingVerificationView />;
  }

  // Active Tab rendering
  switch (currentTab) {
    case 'traditional':
      return <TraditionalMatchView />;
    case 'blind':
      return <BlindDatingView />;
    case 'groups':
      return <GroupsView />;
    case 'chats':
      return <MessagesHub />;
    case 'admin':
      return <AdminPanel />;
    default:
      return <TraditionalMatchView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
        {/* Top Bar following contract */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 pb-16 md:pb-8">
          <MainContent />
        </main>

        {/* Global Modals */}
        <MatchCelebrationModal />
        <RegisterModal />
        <UserSwitcherModal />

        {/* Subtle, unboxed footer following anti-slop guidelines */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px]">
              Campy · Tinder Universitario con Auditoría de Carné y Citas a Ciegas Seguras
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>UNAM</span>
              <span aria-hidden="true">·</span>
              <span>Tec de Monterrey</span>
              <span aria-hidden="true">·</span>
              <span>UBA</span>
              <span aria-hidden="true">·</span>
              <span>Campus Seguro 2026</span>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
