import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Props = {
  roomId: string;
  onClose: () => void;
};

export const OutreachRoom: React.FC<Props> = ({ roomId, onClose }) => {
  const { currentUser, users, outreach, messages, replyToNote } = useApp();
  const row = outreach.find(item => item.id === roomId);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  if (!row) return null;

  const otherId = row.fromId === currentUser.id ? row.toId : row.fromId;
  const other = users.find(user => user.id === otherId);
  const thread = messages[roomId] ?? [];
  const isSuper = row.kind === 'superlike';
  const iAmSender = row.fromId === currentUser.id;
  const recipientReplied = thread.some(
    item => item.senderId === row.toId && item.id !== `${row.id}_open`
  );
  const canCompose = !isSuper && (!iAmSender || recipientReplied);

  const send = async () => {
    const result = await replyToNote(roomId, draft);
    if (result) {
      setError(result);
      return;
    }
    setDraft('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      <header className="flex items-center gap-3 border-b border-slate-800 px-4 pt-[calc(var(--campy-safe-top)+0.75rem)] pb-3">
        <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-300" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
        {other?.photoUrl ? (
          <img src={other.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-800" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{other?.name ?? 'Estudiante'}</p>
          <p className="text-[11px] text-slate-500">{isSuper ? 'Super Like' : 'Mensaje'}</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {isSuper ? (
          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
            {iAmSender ? 'Le mandaste un super like' : 'Te ha mandado un super like'}
          </div>
        ) : (
          thread.map(item => {
            const mine = item.senderId === currentUser.id;
            return (
              <div
                key={item.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? 'ml-auto bg-rose-500 text-white' : 'bg-slate-800 text-slate-100'
                }`}
              >
                {item.content}
              </div>
            );
          })
        )}
      </div>

      {isSuper ? (
        <p className="border-t border-slate-800 px-4 py-3 pb-[calc(1rem+var(--campy-safe-bottom))] text-center text-xs text-slate-500">
          El Super Like solo avisa. No abre chat libre.
        </p>
      ) : canCompose ? (
        <div className="border-t border-slate-800 px-3 pt-3 pb-[calc(0.75rem+var(--campy-safe-bottom))]">
          {error && <p className="mb-2 text-xs text-rose-300">{error}</p>}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={event => setDraft(event.target.value)}
              maxLength={280}
              placeholder="Escribe…"
              className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => void send()}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: '#F43F5E' }}
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <p className="border-t border-slate-800 px-4 py-3 pb-[calc(1rem+var(--campy-safe-bottom))] text-center text-xs text-slate-500">
          Ya enviaste tu mensaje. Si no responde, aquí queda.
        </p>
      )}
    </div>
  );
};
