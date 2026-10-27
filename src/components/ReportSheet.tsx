import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REPORT_REASONS, type ReportReason } from '../lib/moderation';

type Props = {
  userId: string;
  userName: string;
  onClose: () => void;
  onDone?: () => void;
};

export const ReportSheet: React.FC<Props> = ({ userId, userName, onClose, onDone }) => {
  const { reportAndBlock } = useApp();
  const [reason, setReason] = useState<ReportReason>(REPORT_REASONS[0]);
  const [detail, setDetail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setBusy(true);
    setError('');
    const full =
      reason === 'Otro' && detail.trim()
        ? `Otro: ${detail.trim()}`
        : detail.trim()
          ? `${reason} — ${detail.trim()}`
          : reason;
    const message = await reportAndBlock(userId, full);
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    onDone?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 px-3 pb-[calc(1rem+var(--campy-safe-bottom))] sm:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
              <Flag className="h-3.5 w-3.5" />
              Denunciar y bloquear
            </p>
            <h2 className="mt-1 text-lg font-bold font-display">{userName}</h2>
            <p className="mt-1 text-xs text-slate-400">
              No volverás a ver este perfil. El equipo de Campy recibirá el aviso.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {REPORT_REASONS.map(option => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                reason === option
                  ? 'border-rose-400/50 bg-rose-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/60 text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="report-reason"
                className="accent-rose-500"
                checked={reason === option}
                onChange={() => setReason(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <label className="mt-3 block text-xs text-slate-400">
          Detalle (opcional)
          <textarea
            value={detail}
            onChange={event => setDetail(event.target.value)}
            maxLength={280}
            rows={3}
            placeholder="Cuéntanos qué pasó…"
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-rose-400"
          />
        </label>

        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? 'Enviando…' : 'Denunciar'}
          </button>
        </div>
      </div>
    </div>
  );
};
