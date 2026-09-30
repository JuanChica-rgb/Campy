import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Clock, Phone, FileCheck, CheckCircle2, Shield, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';

export const PendingVerificationView: React.FC = () => {
  const { currentUser, approveUser, setCurrentTab, setIsSwitcherOpen } = useApp();

  const handleSimulateApproval = () => {
    approveUser(currentUser.id);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola ${currentUser.name}, soy moderador de Campy Universitario. Para activar tu cuenta, por favor envíanos:\n1. Foto de tu carné universitario vigente\n2. Cédula o DNI\n3. Selfie de confirmación.\n¡Gracias por mantener seguro nuestro campus!`
  );

  const cleanPhone = currentUser.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-white text-center">
        {/* Animated Status Icon */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-950/40">
          <Clock className="h-10 w-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-amber-400 ring-2 ring-amber-500">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>

        {/* Title & Official Notice */}
        <span className="rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 uppercase tracking-wider">
          Estado: Verificación Requerida
        </span>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
          Estamos verificando tu perfil
        </h1>

        <p className="mt-2 text-sm sm:text-base text-amber-200 font-medium max-w-md mx-auto leading-relaxed">
          "En breve te contactaremos por WhatsApp al <strong className="text-white underline">{currentUser.phone}</strong>."
        </p>

        <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
          Para garantizar una comunidad segura y libre de perfiles falsos, todos los universitarios pasan por una rápida auditoría antes de poder chatear y navegar.
        </p>

        {/* Audit Steps explanation */}
        <div className="my-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 sm:p-5 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 text-rose-400" />
            Documentos que te solicitará el moderador por WhatsApp:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-700/60 flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">1</span>
              <div>
                <p className="text-xs font-semibold text-white">Carné Universitario</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Credencial vigente, constancia o tira de materias.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-700/60 flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold">2</span>
              <div>
                <p className="text-xs font-semibold text-white">Documento de Identidad</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Cédula, DNI o pasaporte oficial.</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-700/60 flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">3</span>
              <div>
                <p className="text-xs font-semibold text-white">Selfie de Confirmación</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Para verificar que eres tú quien aparece en la foto.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Submitted Card */}
        <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-4 mb-6 flex items-center gap-4 text-left">
          <img
            src={currentUser.photoUrl}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white truncate">{currentUser.name}, {currentUser.age}</h3>
            <p className="text-xs text-slate-300 truncate">{currentUser.university} · {currentUser.career}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span>{currentUser.semester}º Semestre</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <Phone className="h-3 w-3" />
                {currentUser.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSimulateApproval}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.98]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simular Aprobación y Entrar a Campy</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 px-4 py-3 text-xs sm:text-sm font-semibold text-indigo-300 hover:bg-indigo-600/30 transition"
            >
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>Ver en Panel de Admin</span>
            </button>
          </div>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="text-xs text-slate-400 hover:text-white underline transition"
          >
            O cambiar a otro usuario verificado existente
          </button>
        </div>
      </div>
    </div>
  );
};
