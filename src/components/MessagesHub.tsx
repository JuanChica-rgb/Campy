import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, EyeOff, Users, MessageCircle, Clock, Shield, ChevronRight } from 'lucide-react';
import { ChatRoomModal } from './ChatRoomModal';
import { GroupChatModal } from './GroupChatModal';
import { Group } from '../types';

export const MessagesHub: React.FC = () => {
  const {
    currentUser,
    users,
    matches,
    groups,
    activeChatRoomId,
    activeChatType,
    openChat,
    closeChat
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'traditional' | 'blind' | 'groups'>('traditional');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Filter matches
  const traditionalMatches = matches.filter(m => m.type === 'traditional');
  const blindMatches = matches.filter(m => m.type === 'blind');
  const myGroups = groups.filter(g => g.memberIds.includes(currentUser.id));

  const getPartnerUser = (match: typeof matches[0]) => {
    const otherId = match.user1Id === currentUser.id ? match.user2Id : match.user1Id;
    return users.find(u => u.id === otherId);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Bandeja de Entrada</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Mensajes & Conexiones
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tus conversaciones de match tradicional, salas de citas a ciegas y grupos del campus.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 p-1 border border-slate-700">
        <button
          onClick={() => setActiveSubTab('traditional')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            activeSubTab === 'traditional'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Match Tradicional ({traditionalMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('blind')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            activeSubTab === 'blind'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <EyeOff className="h-4 w-4" />
          <span>Citas a Ciegas ({blindMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('groups')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
            activeSubTab === 'groups'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Mis Grupos ({myGroups.length})</span>
        </button>
      </div>

      {/* Tab 1: Traditional Matches */}
      {activeSubTab === 'traditional' && (
        <div className="space-y-3">
          {traditionalMatches.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
              <Flame className="mx-auto h-10 w-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">Aún no tienes matches tradicionales</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Desliza en la pestaña "Match Tradicional" y dale Me Gusta a los estudiantes de tu facultad.
              </p>
            </div>
          ) : (
            traditionalMatches.map(match => {
              const partner = getPartnerUser(match);
              if (!partner) return null;

              return (
                <div
                  key={match.id}
                  onClick={() => openChat(match.id, 'traditional')}
                  className="flex items-center justify-between rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 hover:border-slate-700 hover:bg-slate-800/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={partner.photoUrl}
                      alt={partner.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{partner.name}</h4>
                        <span className="text-[11px] text-slate-400">· {partner.career}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">
                        {match.lastMessage || '¡Comiencen a chatear!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{match.lastMessageTime}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Blind Dating Matches */}
      {activeSubTab === 'blind' && (
        <div className="space-y-3">
          {/* Top Notice */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs text-indigo-300 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              En las salas de citas a ciegas, las fotos se mantienen bloqueadas. Acuerden verse en un lugar público y seguro del campus.
            </span>
          </div>

          {blindMatches.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
              <EyeOff className="mx-auto h-10 w-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No tienes citas a ciegas activas</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explora el modo "Citas a Ciegas" para conectar por intereses sin fotos de por medio.
              </p>
            </div>
          ) : (
            blindMatches.map(match => {
              const partner = getPartnerUser(match);
              if (!partner) return null;

              return (
                <div
                  key={match.id}
                  onClick={() => openChat(match.id, 'blind')}
                  className="flex items-center justify-between rounded-2xl bg-slate-900/90 border border-indigo-900/40 p-3.5 hover:border-indigo-700/60 hover:bg-slate-800/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-950 to-slate-800 text-indigo-400 border border-indigo-500/30 shrink-0">
                      <EyeOff className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-indigo-200 truncate">
                          {partner.name.split(' ')[0]} (Cita a Ciegas)
                        </h4>
                        <span className="text-[10px] text-slate-400">· {partner.career}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">
                        {match.lastMessage || 'Sala anónima activada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400">{match.lastMessageTime}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: My Groups */}
      {activeSubTab === 'groups' && (
        <div className="space-y-3">
          {myGroups.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
              <Users className="mx-auto h-10 w-10 text-slate-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No te has unido a ningún grupo</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Ve a "Grupos Universitarios" para unirte a comunidades de robótica, anime, deportes y vida de campus.
              </p>
            </div>
          ) : (
            myGroups.map(group => {
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className="flex items-center justify-between rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 hover:border-slate-700 hover:bg-slate-800/80 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={group.coverUrl}
                      alt={group.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{group.name}</h4>
                        <span className="text-[10px] text-slate-400">· {group.category}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5">
                        {group.membersCount} participantes · {group.activeRecentCount} activos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 1-on-1 Chat Room Modal */}
      {activeChatRoomId && activeChatType && activeChatType !== 'group' && (
        <ChatRoomModal
          roomId={activeChatRoomId}
          type={activeChatType}
          onClose={closeChat}
        />
      )}

      {/* Group Chat Modal */}
      {selectedGroup && (
        <GroupChatModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};
