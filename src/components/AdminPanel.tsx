import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Group } from '../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Ban,
  Phone,
  ExternalLink,
  Flame,
  Heart,
  TrendingUp,
  Trash2,
  FileText,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Eye,
  ShieldAlert,
  GraduationCap,
  Plus
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    users,
    groups,
    metrics,
    approveUser,
    rejectUser,
    banUser,
    grantAdmin,
    revokeAdmin,
    reports,
    deleteGroup,
    assignGroupAdmin,
    removeGroupAdmin,
    resetToDefaults,
    universities,
    addUniversity,
    removeUniversityName,
    renameUniversityName
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'verifications' | 'reports' | 'groups_metrics' | 'universities'
  >('verifications');
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);
  const [groupSort, setGroupSort] = useState<'upvotes' | 'popular' | 'concurrency'>('upvotes');
  const [adminBusy, setAdminBusy] = useState<string | null>(null);
  const [uniQuery, setUniQuery] = useState('');
  const [newUniversity, setNewUniversity] = useState('');
  const [editingUniversity, setEditingUniversity] = useState<string | null>(null);
  const [editUniversityValue, setEditUniversityValue] = useState('');
  const [uniError, setUniError] = useState('');
  const [uniBusy, setUniBusy] = useState(false);

  const pendingUsers = users.filter(u => u.verificationStatus === 'pending');
  const auditedUsers = users.filter(
    u => u.verificationStatus === 'approved' || u.verificationStatus === 'rejected'
  );
  const bannedUsers = users.filter(u => u.verificationStatus === 'banned');

  const userName = (id: string) => users.find(u => u.id === id)?.name || 'Usuario';

  const runBan = async (userId: string) => {
    if (!confirm('¿Bloquear esta cuenta? Se borrará su perfil público y verá “Cuenta bloqueada”.')) {
      return;
    }
    setAdminBusy(userId);
    await banUser(userId);
    setAdminBusy(null);
  };

  const runGrantAdmin = async (userId: string) => {
    if (!confirm('¿Dar permisos de administrador a esta cuenta?')) return;
    setAdminBusy(userId);
    await grantAdmin(userId);
    setAdminBusy(null);
  };

  const runRevokeAdmin = async (userId: string) => {
    if (!confirm('¿Quitar admin a esta cuenta?')) return;
    setAdminBusy(userId);
    await revokeAdmin(userId);
    setAdminBusy(null);
  };

  // Sorted groups
  const sortedGroups = [...groups].sort((a, b) => {
    if (groupSort === 'upvotes') return b.upvotesCount - a.upvotesCount;
    if (groupSort === 'popular') return b.membersCount - a.membersCount;
    if (groupSort === 'concurrency') return b.activeRecentCount - a.activeRecentCount;
    return 0;
  });

  const getWhatsAppAuditUrl = (user: User) => {
    const cleanPhone = user.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hola ${user.name}, te escribe el Comité de Seguridad y Verificación de Campy Universitario.\n\nHemos recibido tu registro para ${user.university} (${user.career}). Para validar y activar tu cuenta en la app, por favor envíanos:\n1. Foto de tu carné estudiantil o constancia vigente\n2. Cédula o DNI\n3. Selfie sosteniendo tu credencial.\n\n¡Queremos un campus seguro para todos!`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="mx-auto h-full max-w-6xl space-y-6 overflow-y-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Administración
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verificaciones, universidades y moderación de grupos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            Restaurar Datos Iniciales
          </button>
        </div>
      </div>

      {/* Global Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estudiantes</p>
          <p className="text-2xl font-bold font-display text-white mt-1">{metrics.totalStudents}</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">Registrados en total</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-amber-500/30 p-3.5 bg-amber-950/10">
          <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Pendientes</p>
          <p className="text-2xl font-bold font-display text-amber-400 mt-1">{metrics.pendingCount}</p>
          <p className="text-[10px] text-amber-300 mt-0.5">Esperando auditoría</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-3.5 bg-emerald-950/10">
          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Aprobados</p>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">{metrics.approvedCount}</p>
          <p className="text-[10px] text-emerald-300 mt-0.5">
            {Math.round((metrics.approvedCount / Math.max(1, metrics.totalStudents)) * 100)}% verificado
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
          <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Matches Normal</p>
          <p className="text-2xl font-bold font-display text-rose-400 mt-1">{metrics.totalMatches}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Conexiones activas</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Citas a Ciegas</p>
          <p className="text-2xl font-bold font-display text-indigo-400 mt-1">{metrics.blindMatchesCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Salas anónimas</p>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5">
          <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Grupos Activos</p>
          <p className="text-2xl font-bold font-display text-white mt-1">{metrics.totalGroups}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Comunidades de campus</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveAdminTab('verifications')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeAdminTab === 'verifications'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Verificaciones</span>
          {pendingUsers.length > 0 && (
            <span className="rounded bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-slate-950">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeAdminTab === 'reports'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Denuncias</span>
          {reports.length > 0 && (
            <span className="rounded bg-rose-300 px-1.5 py-0.2 text-[10px] font-bold text-slate-950">
              {reports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('groups_metrics')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeAdminTab === 'groups_metrics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Grupos</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('universities')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeAdminTab === 'universities'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Universidades</span>
        </button>
      </div>

      {/* TAB 1: GESTIÓN DE VERIFICACIONES */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-6">
          {/* Pending queue */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <span>Pendientes de auditoría</span>
                <span className="text-xs text-amber-400 font-normal">({pendingUsers.length} registros)</span>
              </h3>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">¡No hay verificaciones pendientes!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Todos los estudiantes registrados han sido auditados y aprobados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <table className="min-w-[880px] w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Estudiante</th>
                      <th className="px-4 py-3">Teléfono (WhatsApp)</th>
                      <th className="px-4 py-3">Universidad & Carrera</th>
                      <th className="px-4 py-3">Semestre</th>
                      <th className="px-4 py-3">Auditoría Externa</th>
                      <th className="px-4 py-3 text-right">Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={user.photoUrl}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-700"
                            />
                            <div>
                              <p className="font-bold text-white">{user.name}</p>
                              <p className="text-[11px] text-slate-400">{user.age} años</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-emerald-400">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{user.phone}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-200">{user.career}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{user.university}</p>
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                            {user.semester}º
                          </span>
                        </td>

                        {/* WhatsApp Link button */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={getWhatsAppAuditUrl(user)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
                              title="Iniciar auditoría directa por WhatsApp"
                            >
                              <Phone className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="whitespace-nowrap">WhatsApp</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>

                            <button
                              onClick={() => setInspectingUser(user)}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                              title="Inspeccionar expediente estudiantil"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                        {/* Quick action buttons */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            <button
                              onClick={() => approveUser(user.id)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[11px] font-bold text-white shadow hover:bg-emerald-600 transition"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Aprobar</span>
                            </button>

                            <button
                              onClick={() => rejectUser(user.id)}
                              className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 transition"
                              title="Rechazar solicitud"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Rechazar</span>
                            </button>

                            <button
                              onClick={() => void runBan(user.id)}
                              disabled={adminBusy === user.id}
                              className="p-1.5 text-slate-500 hover:text-rose-500 transition disabled:opacity-50"
                              title="Bloquear cuenta"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Already audited students summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider font-display">
              Cuentas registradas ({auditedUsers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {auditedUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800 p-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.phone || user.career}</p>
                      <span
                        className={`text-[10px] flex items-center gap-0.5 ${
                          user.role === 'admin' ? 'text-amber-300' : 'text-emerald-400'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <ShieldAlert className="h-2.5 w-2.5" /> Admin
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-2.5 w-2.5" /> {user.verificationStatus}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <button
                        type="button"
                        onClick={() => void runRevokeAdmin(user.id)}
                        disabled={adminBusy === user.id}
                        className="rounded p-1 text-amber-400 hover:bg-slate-800"
                        title="Quitar admin"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void runGrantAdmin(user.id)}
                        disabled={adminBusy === user.id}
                        className="rounded p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                        title="Dar admin"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void runBan(user.id)}
                      disabled={adminBusy === user.id}
                      className="rounded p-1 text-slate-500 hover:text-rose-400"
                      title="Bloquear cuenta"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {bannedUsers.length > 0 && (
              <p className="mt-3 text-xs text-rose-300">
                Cuentas bloqueadas: {bannedUsers.length}
              </p>
            )}
          </div>
        </div>
      )}

      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-display">Denuncias recibidas</h3>
            <p className="text-xs text-slate-400">
              Cada denuncia también bloquea el perfil para quien reportó.
            </p>
          </div>
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-8 text-center text-sm text-slate-400">
              No hay denuncias todavía.
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map(report => {
                const reported = users.find(u => u.id === report.reportedId);
                return (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">
                          {userName(report.reportedId)}
                          <span className="ml-2 text-[11px] font-normal text-slate-400">
                            reportado por {userName(report.reporterId)}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-rose-200">{report.reason}</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {new Date(report.createdAt).toLocaleString('es-CO')}
                        </p>
                      </div>
                      {reported && reported.verificationStatus !== 'banned' && (
                        <button
                          type="button"
                          onClick={() => void runBan(reported.id)}
                          disabled={adminBusy === reported.id}
                          className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 disabled:opacity-50"
                        >
                          Bloquear cuenta
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MÉTRICAS Y MODERACIÓN DE GRUPOS */}
      {activeAdminTab === 'groups_metrics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Ranking de Grupos Universitarios & Herramientas de Moderación
              </h3>
              <p className="text-xs text-slate-400">
                Orden dinámico según popularidad, concurrencia en tiempo real y votos de la comunidad.
              </p>
            </div>

            {/* Sort selectors */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setGroupSort('upvotes')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  groupSort === 'upvotes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Más Votados</span>
              </button>

              <button
                onClick={() => setGroupSort('popular')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  groupSort === 'popular' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Más Populares</span>
              </button>

              <button
                onClick={() => setGroupSort('concurrency')}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  groupSort === 'concurrency' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Más Concurridos</span>
              </button>
            </div>
          </div>

          {/* Groups Moderation Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Ranking</th>
                  <th className="px-4 py-3">Comunidad / Grupo</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Miembros</th>
                  <th className="px-4 py-3">Concurrencia</th>
                  <th className="px-4 py-3">Votos</th>
                  <th className="px-4 py-3 text-right">Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sortedGroups.map((group, index) => {
                  return (
                    <tr key={group.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-bold text-slate-400 font-mono">
                        #{index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={group.coverUrl}
                            alt={group.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-14 rounded-lg object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white line-clamp-1">{group.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{group.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
                          {group.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-white">
                        {group.membersCount}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          {group.activeRecentCount} activos
                        </span>
                      </td>

                      <td className="px-4 py-3 text-rose-400 font-bold">
                        ♥ {group.upvotesCount}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteGroup(group.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 border border-rose-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition"
                          title="Eliminar grupo por contenido inapropiado"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar Grupo</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeAdminTab === 'universities' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-display text-base font-bold text-white">Universidades al crear cuenta</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Esta lista es la que ven al registrarse. Si no está aquí, no pueden elegirla.
            </p>
          </div>

          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={event => {
              event.preventDefault();
              void (async () => {
                setUniBusy(true);
                setUniError('');
                const error = await addUniversity(newUniversity);
                setUniBusy(false);
                if (error) {
                  setUniError(error);
                  return;
                }
                setNewUniversity('');
              })();
            }}
          >
            <input
              value={newUniversity}
              onChange={event => {
                setNewUniversity(event.target.value);
                setUniError('');
              }}
              placeholder="Nombre de la universidad"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              disabled={uniBusy || newUniversity.trim().length < 3}
              className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </form>

          <input
            value={uniQuery}
            onChange={event => setUniQuery(event.target.value)}
            placeholder="Buscar en la lista"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-rose-400"
          />

          {uniError ? <p className="text-xs text-rose-300">{uniError}</p> : null}

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90">
            {universities
              .filter(name => name.toLowerCase().includes(uniQuery.trim().toLowerCase()))
              .map(name => (
                <div
                  key={name}
                  className="flex items-center gap-2 border-b border-slate-800 px-3 py-2 last:border-b-0"
                >
                  {editingUniversity === name ? (
                    <input
                      value={editUniversityValue}
                      onChange={event => setEditUniversityValue(event.target.value)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-white outline-none focus:border-rose-400"
                    />
                  ) : (
                    <p className="flex-1 text-sm text-slate-100">{name}</p>
                  )}
                  {editingUniversity === name ? (
                    <>
                      <button
                        type="button"
                        disabled={uniBusy}
                        onClick={() => {
                          void (async () => {
                            setUniBusy(true);
                            setUniError('');
                            const error = await renameUniversityName(name, editUniversityValue);
                            setUniBusy(false);
                            if (error) {
                              setUniError(error);
                              return;
                            }
                            setEditingUniversity(null);
                          })();
                        }}
                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUniversity(null)}
                        className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUniversity(name);
                          setEditUniversityValue(name);
                          setUniError('');
                        }}
                        className="rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={uniBusy}
                        onClick={() => {
                          if (!confirm(`¿Quitar ${name} de la lista al crear cuenta?`)) return;
                          void (async () => {
                            setUniBusy(true);
                            setUniError('');
                            const error = await removeUniversityName(name);
                            setUniBusy(false);
                            if (error) setUniError(error);
                          })();
                        }}
                        className="rounded-lg border border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500 hover:text-white"
                      >
                        Quitar
                      </button>
                    </>
                  )}
                </div>
              ))}
            {universities.filter(name =>
              name.toLowerCase().includes(uniQuery.trim().toLowerCase())
            ).length === 0 && (
              <p className="px-3 py-8 text-center text-xs text-slate-500">
                No hay universidades con esa búsqueda.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Audit Dossier Inspector Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Expediente de Auditoría: {inspectingUser.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Documentos requeridos para verificación oficial de estudiante universitario.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <p className="font-semibold text-slate-200">1. Comprobante Universitario:</p>
                <p className="text-slate-400 mt-0.5">Carné UNAM vigente 2026 · Carrera: {inspectingUser.career}</p>
                <div className="mt-2 h-24 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 text-[11px] border border-dashed border-slate-700">
                  [Carné Estudiantil Verificado Vía WhatsApp]
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <p className="font-semibold text-slate-200">2. Cédula / DNI:</p>
                <p className="text-slate-400 mt-0.5">Identidad oficial confirmada con fecha de nacimiento y edad {inspectingUser.age} años.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <p className="font-semibold text-slate-200">3. Contacto WhatsApp:</p>
                <p className="text-emerald-400 font-mono mt-0.5">{inspectingUser.phone}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectingUser(null)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  approveUser(inspectingUser.id);
                  setInspectingUser(null);
                }}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 shadow"
              >
                Aprobar Usuario Inmediatamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
