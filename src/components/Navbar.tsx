import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Flame, Heart, MessageCircle, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { ActiveTab } from '../types';
import { DiscoverySheet } from './DiscoverySheet';
import { BrandMark } from './BrandMark';
import { isNativeApp } from '../lib/webApp';

function CiegasIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M6.8 19.2c.6-2.6 2.6-4 5.2-4s4.6 1.4 5.2 4" />
      <path d="M6.4 8.4h11.2" strokeWidth="2.4" />
    </svg>
  );
}

const DECK_TABS: ActiveTab[] = ['traditional', 'blind'];

const MODES: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'traditional', label: 'Para ti', icon: Flame },
  { id: 'blind', label: 'Ciegas', icon: CiegasIcon }
];

const ITEMS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'traditional', label: 'Para ti', icon: Flame },
  { id: 'blind', label: 'Ciegas', icon: CiegasIcon },
  { id: 'groups', label: 'Explorar', icon: Compass },
  { id: 'likes', label: 'Likes', icon: Heart },
  { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'profile', label: 'Perfil', icon: UserRound }
];

export const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentTab,
    setCurrentTab,
    metrics,
    matches,
    incomingLikes,
    currentUser,
    discovery,
    setDiscovery
  } = useApp();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const lastDeck = useRef<ActiveTab>('traditional');
  const onDeck = DECK_TABS.includes(currentTab);
  const web = !isNativeApp();
  const totalUnread = matches.reduce((acc, match) => acc + (match.unreadCount || 0), 0);
  const likeCount = (incomingLikes[currentUser.id] ?? []).length;

  useEffect(() => {
    if (DECK_TABS.includes(currentTab)) lastDeck.current = currentTab;
  }, [currentTab]);

  const title = currentTab === 'groups'
    ? 'Explorar'
    : currentTab === 'chats'
      ? 'Chats'
      : currentTab === 'likes'
        ? 'Likes'
        : currentTab === 'profile'
          ? 'Perfil'
          : currentTab === 'admin'
            ? 'Verificación'
            : '';

  const badge = (id: ActiveTab) => {
    if (id === 'likes' && likeCount > 0) return likeCount;
    if (id === 'chats' && totalUnread > 0) return totalUnread;
    return 0;
  };

  const go = (id: ActiveTab) => setCurrentTab(id);

  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden ${web ? 'md:flex-row' : ''}`}>
      <aside
        className={`${web ? 'md:flex' : ''} hidden w-[84px] shrink-0 flex-col border-r border-white/10 bg-black px-2 py-4 lg:w-60 lg:px-3`}
      >
        <div className="mb-6 flex items-center justify-center gap-2.5 lg:justify-start lg:px-2">
          <BrandMark size={36} />
          <span className="hidden font-display text-lg font-bold text-white lg:inline">Campy</span>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {ITEMS.map(item => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            const count = badge(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                className={`relative flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold lg:justify-start ${
                  active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="relative">
                  <Icon
                    className={`h-6 w-6 ${item.id === 'likes' && active ? 'fill-[#F43F5E] text-[#F43F5E]' : ''} ${
                      item.id === 'traditional' && active ? 'fill-rose-400 text-rose-300' : ''
                    }`}
                  />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F43F5E] px-1 text-[9px] font-bold text-white lg:hidden">
                      {count}
                    </span>
                  )}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
                {count > 0 && (
                  <span className="ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-[#F43F5E] px-1.5 text-[10px] font-bold text-white lg:flex">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => go('admin')}
              className={`relative flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold lg:justify-start ${
                currentTab === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-6 w-6" />
              <span className="hidden lg:inline">Verificación</span>
              {metrics.pendingCount > 0 && (
                <span className="ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-slate-950 lg:flex">
                  {metrics.pendingCount}
                </span>
              )}
            </button>
          )}
        </nav>
        {onDeck && (
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="mt-2 flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white lg:justify-start"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="hidden lg:inline">Filtros</span>
          </button>
        )}
      </aside>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className={`${web ? 'md:hidden' : ''} sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/95 pt-[calc(var(--campy-safe-top)+0.45rem)] backdrop-blur-md`}
        >
          <div className="relative flex h-14 items-center justify-center px-14">
            <div className="absolute left-3 flex items-center gap-2">
              <BrandMark size={32} />
              {onDeck ? (
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white"
                  aria-label="Preferencias"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            {onDeck ? (
              <div className="flex max-w-full items-center justify-center gap-1 overflow-x-auto">
                {MODES.map(item => {
                  const Icon = item.icon;
                  const active = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
                        active ? 'bg-slate-800 text-white' : 'text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <h1 className="text-lg font-semibold text-white">{title}</h1>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`absolute right-3 flex h-9 w-9 items-center justify-center rounded-full ${
                  currentTab === 'admin' ? 'text-rose-300' : 'text-slate-400'
                }`}
                aria-label="Panel de verificación"
              >
                <ShieldCheck className="h-4 w-4" />
                {metrics.pendingCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-slate-950">
                    {metrics.pendingCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

        <nav
          className={`${web ? 'md:hidden' : ''} absolute inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 pb-[calc(0.85rem+var(--campy-safe-bottom))] pt-2 backdrop-blur-md`}
        >
          <div className="mx-auto flex max-w-lg items-end justify-around">
            {[
              { id: 'swipe' as const, label: 'Swipe', icon: Flame },
              { id: 'groups' as const, label: 'Explorar', icon: Compass },
              { id: 'likes' as const, label: 'Likes', icon: Heart },
              { id: 'chats' as const, label: 'Chats', icon: MessageCircle },
              { id: 'profile' as const, label: 'Perfil', icon: UserRound }
            ].map(item => {
              const Icon = item.icon;
              const active = item.id === 'swipe' ? onDeck : currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id === 'swipe' ? lastDeck.current : item.id)}
                  className={`flex min-w-0 flex-col items-center gap-0.5 px-1 py-1 text-[11px] font-medium ${
                    active ? 'text-rose-300' : 'text-slate-500'
                  }`}
                >
                  <span className="relative">
                    <Icon
                      className={`h-6 w-6 ${
                        item.id === 'swipe' && active ? 'fill-rose-400 text-rose-300' : ''
                      } ${item.id === 'likes' && active ? 'fill-[#F43F5E] text-[#F43F5E]' : ''}`}
                    />
                    {item.id === 'likes' && likeCount > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F43F5E] px-1 text-[9px] font-bold text-white">
                        {likeCount}
                      </span>
                    )}
                    {item.id === 'chats' && totalUnread > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F43F5E] px-1 text-[9px] font-bold text-white">
                        {totalUnread}
                      </span>
                    )}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {filtersOpen && (
          <DiscoverySheet prefs={discovery} onChange={setDiscovery} onClose={() => setFiltersOpen(false)} />
        )}
      </div>
    </div>
  );
};
