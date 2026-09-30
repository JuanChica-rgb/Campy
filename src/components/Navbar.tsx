import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, EyeOff, Users, MessageCircle, ShieldCheck, UserCheck, Sparkles, UserPlus } from 'lucide-react';
import { ActiveTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    setIsRegisterOpen,
    setIsSwitcherOpen,
    metrics,
    matches
  } = useApp();

  const totalUnreadMatches = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'traditional', label: 'Match Tradicional', icon: Flame },
    { id: 'blind', label: 'Citas a Ciegas', icon: EyeOff },
    { id: 'groups', label: 'Grupos Universitarios', icon: Users },
    { id: 'chats', label: 'Chats & Matches', icon: MessageCircle }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('traditional')}
            className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-white transition hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 text-white shadow-md shadow-rose-950/40">
              <Flame className="h-5 w-5 fill-white" />
            </span>
            <span className="font-display tracking-tight text-white text-2xl font-black">
              campy
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-800/60 p-1 border border-slate-700/50">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-950'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'chats' && totalUnreadMatches > 0 && (
                  <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-950">
                    {totalUnreadMatches}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin panel toggle */}
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${
              currentTab === 'admin'
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
            title="Panel de verificación y moderación de grupos"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">Panel Admin</span>
            {metrics.pendingCount > 0 && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                {metrics.pendingCount} pend.
              </span>
            )}
          </button>

          {/* New Register modal button */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
          >
            <UserPlus className="h-3.5 w-3.5 text-rose-400" />
            <span>Registrar Estudiante</span>
          </button>

          {/* User profile & demo switcher */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 p-1 pr-2.5 transition-colors hover:border-slate-600 hover:bg-slate-700/60"
            title="Cambiar usuario de prueba / Ver perfil"
          >
            <img
              src={currentUser.photoUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-600"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                {currentUser.verificationStatus === 'approved' ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <UserCheck className="h-3 w-3" /> Verificado
                  </span>
                ) : (
                  <span className="text-amber-400">Pendiente</span>
                )}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-900/95 px-2 py-1 justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[11px] font-medium transition ${
                isActive ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.id === 'chats' && totalUnreadMatches > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950">
                    {totalUnreadMatches}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
