import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Match, ChatMessage, User } from '../types';
import {
  X,
  Send,
  Lock,
  Shield,
  Info,
  MapPin,
  Sparkles,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface ChatRoomModalProps {
  roomId: string;
  type: 'traditional' | 'blind';
  onClose: () => void;
}

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({ roomId, type, onClose }) => {
  const {
    currentUser,
    users,
    matches,
    messages,
    sendMessage,
    setSelectedProfileUser
  } = useApp();

  const [inputText, setInputText] = useState('');

  const currentMatch = matches.find(m => m.id === roomId);
  const isBlind = type === 'blind';

  // Partner user
  const otherUserId = currentMatch
    ? currentMatch.user1Id === currentUser.id
      ? currentMatch.user2Id
      : currentMatch.user1Id
    : null;

  const partner = users.find(u => u.id === otherUserId);
  const roomMessages = messages[roomId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(roomId, inputText);
    setInputText('');
  };

  const handleSuggestSpot = (spot: string) => {
    sendMessage(roomId, `¿Te gustaría que nos viéramos en ${spot}? Es un lugar público y seguro del campus 👍`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-white">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4">
          <div className="flex items-center gap-3 min-w-0">
            {isBlind ? (
              // Blind Mode: STRICTLY LOCKED AVATAR (no photo can be clicked or shown)
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-950 to-rose-950 text-indigo-300 border border-indigo-500/30 shrink-0"
                title="Fotografía bloqueada por cita a ciegas"
              >
                <Lock className="h-4 w-4 text-rose-400" />
              </div>
            ) : partner ? (
              // Traditional Mode: Clickable photo
              <button
                onClick={() => setSelectedProfileUser(partner)}
                className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-slate-700 hover:ring-rose-500 transition shrink-0"
                title="Ver perfil completo del estudiante"
              >
                <img
                  src={partner.photoUrl}
                  alt={partner.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : null}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {isBlind
                    ? partner
                      ? `${partner.name.split(' ')[0]} (Cita a Ciegas)`
                      : 'Cita a Ciegas'
                    : partner?.name || 'Estudiante'}
                </h3>
                {isBlind ? (
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                    🔒 Modo Anónimo
                  </span>
                ) : (
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 border border-emerald-500/30">
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {partner?.university} · {partner?.career} ({partner?.semester}º sem.)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isBlind && partner && (
              <button
                onClick={() => setSelectedProfileUser(partner)}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <Info className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ver Perfil</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PINNED SYSTEM NOTICE FOR BLIND DATING (MANDATORY REQUIREMENT) */}
        {isBlind && (
          <div className="border-b border-rose-500/30 bg-rose-950/30 px-4 py-3 text-xs text-rose-200">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-300">Mensaje de Seguridad Oficial Campy:</p>
                <p className="text-rose-100/90 leading-relaxed italic">
                  "Este chat fue creado para encontrarse y tener una cita a ciegas. Por favor, acuerden verse en un lugar público dentro o fuera del campus para la seguridad de ambos."
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-rose-300">
                  <span className="font-semibold text-white">Sugerencias seguras:</span>
                  <button
                    onClick={() => handleSuggestSpot('la Cafetería Central del Campus')}
                    className="rounded bg-rose-900/60 px-2 py-0.5 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
                  >
                    📍 Cafetería Central
                  </button>
                  <button
                    onClick={() => handleSuggestSpot('las mesas de la Biblioteca Principal')}
                    className="rounded bg-rose-900/60 px-2 py-0.5 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
                  >
                    📍 Biblioteca
                  </button>
                  <button
                    onClick={() => handleSuggestSpot('la plazoleta o jardines frente a rectoría')}
                    className="rounded bg-rose-900/60 px-2 py-0.5 hover:bg-rose-800 text-rose-200 border border-rose-700/50"
                  >
                    📍 Plazoleta Central
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {roomMessages.map(msg => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="mx-auto max-w-md my-2 rounded-xl bg-slate-800/60 border border-slate-700/60 p-3 text-center text-xs text-slate-300">
                  <Shield className="h-4 w-4 mx-auto text-rose-400 mb-1" />
                  <p className="italic text-slate-200 font-medium">"{msg.content}"</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{msg.timestamp}</span>
                </div>
              );
            }

            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs max-w-[85%] sm:max-w-md leading-relaxed ${
                    isMe
                      ? isBlind
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-rose-500 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/70'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-1 text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="border-t border-slate-800 bg-slate-900 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isBlind ? "Escribe un mensaje para acordar la cita a ciegas..." : "Escribe un mensaje para romper el hielo..."}
              className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white disabled:opacity-50 transition ${
                isBlind ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-950/60' : 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-950/60'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
