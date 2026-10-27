import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Group } from '../types';
import { GroupChatModal } from './GroupChatModal';
import { CreateGroupModal } from './CreateGroupModal';
import { ProfileModal } from './ProfileModal';
import { Users, Plus, Search } from 'lucide-react';

export const GroupsView: React.FC = () => {
  const {
    groups,
    currentUser,
    joinGroup,
    setIsCreateGroupOpen,
    selectedProfileUser,
    setSelectedProfileUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupForChat, setSelectedGroupForChat] = useState<Group | null>(null);

  const query = searchQuery.trim().toLowerCase();

  const filteredGroups = groups
    .filter(group => !(group.bannedIds ?? []).includes(currentUser.id))
    .filter(group => {
      if (!query) return true;
      return (
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.inviteCode.toLowerCase().includes(query) ||
        group.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => b.membersCount - a.membersCount);

  return (
    <div className="mx-auto h-full max-w-6xl space-y-5 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-600 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Crear grupo</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre o código"
          className="w-full rounded-xl border border-slate-700/80 bg-slate-800/80 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:outline-none"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
          <Users className="mx-auto mb-3 h-12 w-12 text-slate-600" />
          <h3 className="text-base font-bold text-white">No se encontraron grupos</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            {searchQuery.trim()
              ? 'Prueba con otro nombre o código.'
              : 'Crea un grupo o búscale por nombre o código para unirte.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map(group => {
            const isMember = group.memberIds.includes(currentUser.id);
            const enterGroup = () => {
              if (!isMember) joinGroup(group.id);
              setSelectedGroupForChat(group);
            };

            return (
              <article
                key={group.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90"
              >
                <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                  <img
                    src={group.coverUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <span className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {group.membersCount} miembro{group.membersCount === 1 ? '' : 's'}
                  </span>
                  {group.inviteCode && (
                    <span className="absolute right-3 top-3 rounded-lg border border-white/15 bg-slate-950/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white">
                      {group.inviteCode}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-display text-base font-bold text-white">
                    {group.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{group.description}</p>
                  <button
                    onClick={enterGroup}
                    className="mt-4 rounded-xl bg-rose-500 py-2 text-xs font-bold text-white transition hover:bg-rose-600"
                  >
                    {isMember ? 'Entrar' : 'Unirme'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedGroupForChat && (
        <GroupChatModal
          group={
            groups.find(group => group.id === selectedGroupForChat.id) || selectedGroupForChat
          }
          onClose={() => setSelectedGroupForChat(null)}
        />
      )}

      <CreateGroupModal />

      {selectedProfileUser && (
        <ProfileModal user={selectedProfileUser} onClose={() => setSelectedProfileUser(null)} />
      )}
    </div>
  );
};
