import React from 'react';
import { useApp } from '../context/AppContext';
import { X, UserCheck, Clock, ShieldCheck, UserPlus, Sparkles, Check } from 'lucide-react';
import { User } from '../types';

export const UserSwitcherModal: React.FC = () => {
  const {
    isSwitcherOpen,
    setIsSwitcherOpen,
    users,
    currentUser,
    setCurrentUser,
    setIsRegisterOpen
  } = useApp();

  if (!isSwitcherOpen) return null;

  const handleSelect = (user: User) => {
    setCurrentUser(user);
    setIsSwitcherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 text-white shadow-2xl">
        <button
          onClick={() => setIsSwitcherOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Perfiles de Demostración</span>
        </div>
        <h3 className="text-xl font-bold font-display text-white">Cambiar de Estudiante</h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Cambia de cuenta para probar los diferentes estados de la app (aprobado, pendiente de auditoría por WhatsApp o administrador).
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {users.map(user => {
            const isSelected = user.id === currentUser.id;
            const isPending = user.verificationStatus === 'pending';
            const isAdmin = user.role === 'admin';

            return (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className={`w-full flex items-center justify-between rounded-2xl p-3 text-left transition border ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500'
                    : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">{user.name}</p>
                      {isSelected && <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {user.career} · {user.semester}º sem.
                    </p>
                    <div className="mt-0.5">
                      {isAdmin ? (
                        <span className="text-[10px] text-indigo-400 font-semibold">Moderador Oficial</span>
                      ) : isPending ? (
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> Verificación Pendiente
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <UserCheck className="h-3 w-3" /> Estudiante Aprobado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              setIsSwitcherOpen(false);
              setIsRegisterOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 transition"
          >
            <UserPlus className="h-4 w-4 text-rose-400" />
            <span>Registrar Nuevo Estudiante (Paso a Paso)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
