import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Group, GroupCategory } from '../types';
import { GroupChatModal } from './GroupChatModal';
import { CreateGroupModal } from './CreateGroupModal';
import { ProfileModal } from './ProfileModal';
import {
  Users,
  Plus,
  Flame,
  Heart,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Shield,
  Search,
  Check
} from 'lucide-react';

const CATEGORIES: (GroupCategory | 'Todos')[] = [
  'Todos',
  'Robótica & Tech',
  'Integración Campus',
  'Anime & Otaku',
  'Club de Lectura & Café',
  'Deportes & Fitness',
  'Fiesta & Vida Nocturna'
];

type SortMode = 'popular' | 'concurrency' | 'upvotes';

export const GroupsView: React.FC = () => {
  const {
    groups,
    currentUser,
    joinGroup,
    upvoteGroup,
    setIsCreateGroupOpen,
    selectedProfileUser,
    setSelectedProfileUser
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<GroupCategory | 'Todos'>('Todos');
  const [sortMode, setSortMode] = useState<SortMode>('concurrency');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupForChat, setSelectedGroupForChat] = useState<Group | null>(null);

  // Filter and Sort groups
  const filteredGroups = groups
    .filter(g => {
      if (activeCategory !== 'Todos' && g.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = g.name.toLowerCase().includes(query);
        const matchesDesc = g.description.toLowerCase().includes(query);
        const matchesTag = g.tags.some(t => t.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesTag;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortMode === 'concurrency') {
        return b.activeRecentCount - a.activeRecentCount;
      }
      if (sortMode === 'popular') {
        return b.membersCount - a.membersCount;
      }
      if (sortMode === 'upvotes') {
        return b.upvotesCount - a.upvotesCount;
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
      {/* Header & Create Group CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <Users className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Comunidades de Campus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Grupos Universitarios
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Únete a comunidades según tus gustos, comparte en tiempo real y encuentra compañeros de estudio.
          </p>
        </div>

        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/60 hover:from-rose-600 hover:to-rose-700 transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Grupo Libre</span>
        </button>
      </div>

      {/* Search, Sort and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por temática, robótica, anime, deportes..."
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Sort Segments */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-800/80 p-1 border border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => setSortMode('concurrency')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortMode === 'concurrency'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Más Concurridos</span>
            </button>

            <button
              onClick={() => setSortMode('popular')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortMode === 'popular'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Más Populares</span>
            </button>

            <button
              onClick={() => setSortMode('upvotes')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                sortMode === 'upvotes'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Más Votados</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === category
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
          <Users className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white">No se encontraron grupos en esta categoría</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Sé el primero en iniciar un grupo para tu facultad o campus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map(group => {
            const isMember = group.memberIds.includes(currentUser.id);
            const isAdmin = group.adminIds.includes(currentUser.id) || group.creatorId === currentUser.id;

            return (
              <div
                key={group.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-lg hover:border-slate-600 transition-all duration-200"
              >
                {/* Cover Image & Category */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                  <img
                    src={group.coverUrl}
                    alt={group.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/30" />

                  {/* Badges on cover */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-md bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 border border-rose-500/20">
                      {group.category}
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        upvoteGroup(group.id);
                      }}
                      className="flex items-center gap-1 rounded-full bg-slate-950/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-rose-400 border border-white/10 hover:bg-rose-500 hover:text-white transition"
                      title="Votar por este grupo"
                    >
                      <Heart className="h-3.5 w-3.5 fill-rose-500" />
                      <span>{group.upvotesCount}</span>
                    </button>
                  </div>

                  {/* Active concurrency badge */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{group.activeRecentCount} en línea ahora</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold font-display text-white line-clamp-1 group-hover:text-rose-300 transition">
                        {group.name}
                      </h3>
                      {isAdmin && (
                        <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                          Admin
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {group.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400 border border-slate-700/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      <strong>{group.membersCount}</strong> universitarios
                    </span>

                    <div className="flex items-center gap-2">
                      {!isMember && (
                        <button
                          onClick={() => joinGroup(group.id)}
                          className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                        >
                          Unirme
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (!isMember) joinGroup(group.id);
                          setSelectedGroupForChat(group);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-950/40 hover:bg-rose-600 transition"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Abrir Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Group Chat Modal */}
      {selectedGroupForChat && (
        <GroupChatModal
          group={selectedGroupForChat}
          onClose={() => setSelectedGroupForChat(null)}
        />
      )}

      {/* Create Group Modal */}
      <CreateGroupModal />

      {/* Profile inspection */}
      {selectedProfileUser && (
        <ProfileModal
          user={selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
        />
      )}
    </div>
  );
};
