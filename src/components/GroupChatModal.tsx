import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Group, ChatMessage, User } from '../types';
import {
  X,
  Send,
  Users,
  Shield,
  Trash2,
  UserMinus,
  UserPlus,
  Crown,
  Heart,
  ChevronRight,
  Info,
  Edit3,
  Check
} from 'lucide-react';

interface GroupChatModalProps {
  group: Group;
  onClose: () => void;
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({ group, onClose }) => {
  const {
    currentUser,
    users,
    messages,
    sendMessage,
    deleteMessage,
    assignGroupAdmin,
    removeGroupAdmin,
    kickGroupMember,
    upvoteGroup,
    setSelectedProfileUser
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [editDesc, setEditDesc] = useState(group.description);

  const groupMessages = messages[group.id] || [];
  const isCreator = group.creatorId === currentUser.id;
  const isAdmin = group.adminIds.includes(currentUser.id) || isCreator;

  // Resolve members
  const memberUsers = group.memberIds
    .map(id => users.find(u => u.id === id))
    .filter((u): u is User => Boolean(u));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(group.id, inputText);
    setInputText('');
  };

  const handleMemberClick = (user: User) => {
    setSelectedProfileUser(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-white">
        {/* Main Chat Panel */}
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={group.coverUrl}
                alt={group.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                    {group.name}
                  </h3>
                  {isAdmin && (
                    <span className="flex items-center gap-0.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{group.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{group.membersCount} miembros</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => upvoteGroup(group.id)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-slate-700 transition"
                title="Votar por este grupo"
              >
                <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                <span className="text-white text-xs">{group.upvotesCount}</span>
              </button>

              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  showParticipants
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
                title="Ver participantes"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Miembros</span>
              </button>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Group Pinned Info & Rules Bar */}
          <div className="border-b border-slate-800/80 bg-slate-800/40 px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
            <p className="truncate mr-2">
              <strong className="text-slate-200">Info:</strong> {group.description}
            </p>
            {isAdmin && !isEditingInfo && (
              <button
                onClick={() => setIsEditingInfo(true)}
                className="text-[11px] text-rose-400 hover:underline shrink-0 flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" /> Editar
              </button>
            )}
          </div>

          {/* Edit Group Info Box (if opened by admin) */}
          {isEditingInfo && (
            <div className="bg-slate-800 p-3 border-b border-slate-700 space-y-2 text-xs animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400">Herramientas de Administración: Editar Grupo</span>
                <button onClick={() => setIsEditingInfo(false)} className="text-slate-400 hover:text-white">
                  Cancelar
                </button>
              </div>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
                placeholder="Nombre del grupo"
              />
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2 text-xs text-white"
                placeholder="Descripción del grupo"
                rows={2}
              />
              <button
                onClick={() => {
                  group.name = editName;
                  group.description = editDesc;
                  setIsEditingInfo(false);
                }}
                className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-bold text-white hover:bg-rose-600"
              >
                Guardar Cambios
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
            {groupMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 p-6">
                <Users className="h-10 w-10 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Aún no hay mensajes en este grupo</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Sé el primero en saludar a tus compañeros universitarios o proponer un plan.
                </p>
              </div>
            ) : (
              groupMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                const senderIsAdmin = group.adminIds.includes(msg.senderId) || group.creatorId === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`group flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <button
                        onClick={() => {
                          const sender = users.find(u => u.id === msg.senderId);
                          if (sender) setSelectedProfileUser(sender);
                        }}
                        className="h-8 w-8 rounded-lg overflow-hidden shrink-0 mt-1 ring-1 ring-slate-700 hover:ring-rose-500 transition"
                        title="Ver perfil de estudiante"
                      >
                        <img
                          src={
                            msg.senderPhoto ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={msg.senderName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )}

                    <div className="relative max-w-[80%] sm:max-w-md">
                      {!isMe && (
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                          <button
                            onClick={() => {
                              const sender = users.find(u => u.id === msg.senderId);
                              if (sender) setSelectedProfileUser(sender);
                            }}
                            className="font-semibold text-rose-300 hover:underline"
                          >
                            {msg.senderName}
                          </button>
                          {senderIsAdmin && (
                            <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                              Admin
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">· {msg.timestamp}</span>
                        </div>
                      )}

                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.isDeleted
                            ? 'bg-slate-800/40 text-slate-500 italic border border-slate-800'
                            : isMe
                            ? 'bg-rose-500 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Admin Message Deletion tool (WhatsApp style) */}
                      {isAdmin && !msg.isDeleted && (
                        <button
                          onClick={() => deleteMessage(group.id, msg.id)}
                          className="opacity-0 group-hover:opacity-100 absolute -right-6 top-1 text-slate-500 hover:text-rose-400 transition"
                          title="Eliminar mensaje como administrador"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="border-t border-slate-800 bg-slate-900 p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={`Mensaje en #${group.name}...`}
                className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 transition shadow-md shadow-rose-950/50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Participant Drawer / Inspector */}
        {showParticipants && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Participantes ({memberUsers.length})
                </h4>
                <p className="text-[11px] text-slate-500">Toca un usuario para ver su perfil público</p>
              </div>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {memberUsers.map(member => {
                const memberIsCreator = member.id === group.creatorId;
                const memberIsAdmin = group.adminIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl bg-slate-800/60 p-2 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <button
                      onClick={() => handleMemberClick(member)}
                      className="flex items-center gap-2.5 text-left min-w-0 flex-1 hover:opacity-90"
                    >
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                            {member.name}
                          </p>
                          {memberIsCreator ? (
                            <span className="flex items-center gap-0.5 rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-300">
                              <Crown className="h-2.5 w-2.5" /> Creador
                            </span>
                          ) : memberIsAdmin ? (
                            <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                              Admin
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {member.career}
                        </p>
                      </div>
                    </button>

                    {/* Admin Actions on Members (WhatsApp style) */}
                    {isAdmin && member.id !== currentUser.id && (
                      <div className="flex items-center gap-1 shrink-0">
                        {!memberIsAdmin ? (
                          <button
                            onClick={() => assignGroupAdmin(group.id, member.id)}
                            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition"
                            title="Hacer Administrador"
                          >
                            <Shield className="h-3.5 w-3.5" />
                          </button>
                        ) : isCreator ? (
                          <button
                            onClick={() => removeGroupAdmin(group.id, member.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition"
                            title="Quitar Administrador"
                          >
                            <UserMinus className="h-3.5 w-3.5 text-amber-400" />
                          </button>
                        ) : null}

                        {/* Expel member */}
                        <button
                          onClick={() => kickGroupMember(group.id, member.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                          title="Expulsar del grupo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
