import React, { useMemo, useState } from 'react';
import { EyeOff, Search, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatRoomModal } from './ChatRoomModal';
import { GroupChatModal } from './GroupChatModal';
import { OutreachRoom } from './OutreachRoom';
import { publicName } from '../lib/privacy';
import type { Group } from '../types';

type ChatRow = {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread: number;
  kind: 'traditional' | 'blind' | 'group' | 'outreach';
  photoUrl?: string;
  sortKey: number;
  onOpen: () => void;
};

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function recency(label?: string): number {
  if (!label) return 5000;
  const text = label.toLowerCase();
  if (text.includes('recién') || text.includes('recien')) return 0;
  const minutes = text.match(/hace\s+(\d+)\s*min/);
  if (minutes) return Number(minutes[1]);
  if (text.startsWith('hoy')) return 180;
  const hours = text.match(/hace\s+(\d+)\s*h/);
  if (hours) return 60 + Number(hours[1]) * 60;
  if (text.startsWith('ayer')) return 1600;
  return 3000;
}

export const MessagesHub: React.FC = () => {
  const {
    currentUser,
    users,
    matches,
    outreach,
    groups,
    messages,
    activeChatRoomId,
    activeChatType,
    openChat,
    closeChat,
    isBlocked
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const rows = useMemo(() => {
    const list: ChatRow[] = [];

    outreach.forEach(row => {
      const otherId = row.fromId === currentUser.id ? row.toId : row.fromId;
      if (isBlocked(otherId)) return;
      const partner = users.find(user => user.id === otherId);
      if (!partner) return;
      const mine = row.fromId === currentUser.id;
      const preview =
        row.kind === 'superlike'
          ? mine
            ? 'Le mandaste un super like'
            : 'Te ha mandado un super like'
          : mine
            ? `Tú: ${row.body ?? ''}`
            : row.body ?? '';
      list.push({
        id: row.id,
        title: partner.name,
        preview,
        time: '',
        unread: 0,
        kind: 'outreach',
        photoUrl: partner.photoUrl,
        sortKey: row.kind === 'superlike' ? -20 : -10,
        onOpen: () => openChat(row.id, 'outreach')
      });
    });

    matches.forEach(match => {
      const otherId = match.user1Id === currentUser.id ? match.user2Id : match.user1Id;
      if (isBlocked(otherId)) return;
      const partner = users.find(user => user.id === otherId);
      if (!partner) return;
      const isBlind = match.type === 'blind' && !match.revealedAt;
      list.push({
        id: match.id,
        title: isBlind ? partner.name.split(' ')[0] : partner.name,
        preview: match.lastMessage || (isBlind ? 'Cita a ciegas activa' : 'Empiecen a chatear'),
        time: match.lastMessageTime || '',
        unread: match.unreadCount || 0,
        kind: isBlind ? 'blind' : 'traditional',
        photoUrl: isBlind ? undefined : partner.photoUrl,
        sortKey: recency(match.lastMessageTime) - (match.unreadCount ? 10000 : 0),
        onOpen: () => openChat(match.id, isBlind ? 'blind' : 'traditional')
      });
    });

    groups
      .filter(group => group.memberIds.includes(currentUser.id))
      .forEach(group => {
        const thread = messages[group.id] || [];
        const last = thread[thread.length - 1];
        const fromMe = last?.senderId === currentUser.id;
        const lastSender = last ? users.find(user => user.id === last.senderId) : undefined;
        const lastLabel = lastSender
          ? publicName(currentUser.id, lastSender, matches).split(' ')[0]
          : last?.senderName.split(' ')[0];
        const preview = last
          ? `${fromMe ? 'Tú' : lastLabel}: ${last.content}`
          : group.description;
        list.push({
          id: group.id,
          title: group.name,
          preview,
          time: last?.timestamp || '',
          unread: 0,
          kind: 'group',
          photoUrl: group.coverUrl,
          sortKey: recency(last?.timestamp),
          onOpen: () => setSelectedGroup(group)
        });
      });

    return list.sort((a, b) => a.sortKey - b.sortKey);
  }, [currentUser.id, users, matches, outreach, groups, messages, openChat, isBlocked]);

  const visibleRows = rows.filter(row => {
    const text = normalize(query.trim());
    if (!text) return true;
    return normalize(row.title).includes(text) || normalize(row.preview).includes(text);
  });

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden bg-black md:max-w-2xl">
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar un chat"
            className="w-full rounded-full border border-slate-800 bg-slate-800/90 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-slate-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {visibleRows.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-slate-500">
            {query ? 'Ningún chat coincide con esa búsqueda.' : 'Todavía no tienes conversaciones.'}
          </p>
        ) : (
          visibleRows.map(row => (
            <button
              key={row.id}
              type="button"
              onClick={row.onOpen}
              className="flex w-full items-center gap-3 border-b border-slate-800/80 px-4 py-3 text-left transition hover:bg-slate-900"
            >
              {row.photoUrl ? (
                <img
                  src={row.photoUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-950 text-indigo-300">
                  <EyeOff className="h-5 w-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5">
                    {row.kind === 'group' && <Users className="h-3.5 w-3.5 shrink-0 text-slate-500" />}
                    <span className="truncate text-[15px] font-semibold text-white">{row.title}</span>
                  </span>
                  <span className={`shrink-0 text-[11px] ${row.unread > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {row.time}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center justify-between gap-3">
                  <span className="truncate text-[13px] text-slate-400">
                    {row.kind === 'blind' && <span className="text-indigo-300">Cita a ciegas · </span>}
                    {row.preview}
                  </span>
                  {row.unread > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-slate-950">
                      {row.unread}
                    </span>
                  )}
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      {activeChatRoomId && activeChatType === 'outreach' && (
        <OutreachRoom roomId={activeChatRoomId} onClose={closeChat} />
      )}
      {activeChatRoomId && activeChatType && activeChatType !== 'group' && activeChatType !== 'outreach' && (
        <ChatRoomModal roomId={activeChatRoomId} type={activeChatType} onClose={closeChat} />
      )}
      {selectedGroup && (
        <GroupChatModal
          group={groups.find(group => group.id === selectedGroup.id) || selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};
