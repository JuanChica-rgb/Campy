import React, { useState } from 'react';
import { DiscoveryPrefs, InterestIn, Seeking } from '../types';
import { X } from 'lucide-react';

const SEEKING: { id: Seeking; label: string }[] = [
  { id: 'pareja', label: 'Pareja estable' },
  { id: 'pareja-abierta', label: 'Pareja estable, pero no me cierro' },
  { id: 'veremos', label: 'Nada serio, pero veremos' },
  { id: 'nada-serio', label: 'Nada serio' },
  { id: 'amigos', label: 'Hacer amigxs' },
  { id: 'pensando', label: 'Lo sigo pensando' }
];

const INTEREST: { id: InterestIn; label: string }[] = [
  { id: 'mujeres', label: 'Mujeres' },
  { id: 'hombres', label: 'Hombres' },
  { id: 'todos', label: 'Ambos' }
];

const LANGUAGES = [
  'Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 'Alemán',
  'Mandarín', 'Japonés', 'Coreano', 'Árabe', 'Ruso', 'Catalán',
  'Quechua', 'Náhuatl', 'Guaraní', 'Lengua de señas'
];

const ZODIAC = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const FAMILY = [
  'Quiero hijos',
  'No quiero hijos',
  'Ya tengo hijos y quiero más',
  'Ya tengo hijos y no quiero más',
  'Todavía no sé'
];

const COMMUNICATION = [
  'Mensajes',
  'Llamada telefónica',
  'Videollamada',
  'No mando mensajes, mejor en persona'
];

const LOVE = ['Detalles', 'Regalos', 'Contacto físico', 'Cumplidos', 'Tiempo de calidad'];

const PETS = [
  'Perro', 'Gato', 'Conejo', 'Hámster', 'Cobaya', 'Hurón', 'Chinchilla',
  'Erizo', 'Ratón', 'Ave', 'Loro', 'Canario', 'Periquito', 'Pez',
  'Tortuga', 'Lagarto', 'Serpiente', 'Rana', 'Caballo', 'Pony',
  'Cerdito', 'Cabra', 'Oveja', 'Pato', 'Gallina', 'Hámster ruso'
];

const DRINKING = [
  'No es lo mío',
  'No bebo alcohol',
  'Explorando la sobriedad',
  'En ocasiones especiales',
  'Socialmente los fines',
  'Casi a diario'
];

const SMOKING = ['No fumo', 'Fumo', 'Fumo con amigos', 'Fumo cuando bebo', 'Intento dejarlo'];

const SOCIALS = ['Las uso bastante', 'No las uso', 'Deslizo y no posteo'];

type ChipPage =
  | 'busco'
  | 'interes'
  | 'idiomas'
  | 'zodiaco'
  | 'familia'
  | 'comunicacion'
  | 'amor'
  | 'mascotas'
  | 'beber'
  | 'fumar'
  | 'redes';

const TITLES: Record<ChipPage, string> = {
  busco: 'Busco',
  interes: 'Interesado en',
  idiomas: 'Idiomas',
  zodiaco: 'Zodiaco',
  familia: 'Planes familiares',
  comunicacion: 'Estilo de comunicación',
  amor: 'Estilo de amor',
  mascotas: 'Mascotas',
  beber: 'Beber',
  fumar: '¿Cada cuánto fumas?',
  redes: 'Redes sociales'
};

interface DiscoverySheetProps {
  prefs: DiscoveryPrefs;
  onChange: (prefs: DiscoveryPrefs) => void;
  onClose: () => void;
}

function summary(values: string[]) {
  if (!values.length) return 'Seleccionar';
  if (values.length <= 2) return values.join(', ');
  return `${values.slice(0, 2).join(', ')} +${values.length - 2}`;
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value];
}

export const DiscoverySheet: React.FC<DiscoverySheetProps> = ({ prefs, onChange, onClose }) => {
  const [page, setPage] = useState<ChipPage | 'main'>('main');
  const seekingLabel = SEEKING.find(item => item.id === prefs.seeking)?.label ?? 'Seleccionar';
  const interestLabel = INTEREST.find(item => item.id === prefs.interestIn)?.label ?? 'Todos';

  const chip = (label: string, selected: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm ${
        selected ? 'border-white bg-white text-slate-900' : 'border-white/15 text-slate-200'
      }`}
    >
      {label}
    </button>
  );

  const chips = page === 'main' ? null : page === 'interes' ? (
    <div className="space-y-2 px-5 pb-8">
      {INTEREST.map(item => (
        <button
          key={item.id}
          onClick={() => onChange({ ...prefs, interestIn: item.id })}
          className={`block w-full rounded-2xl px-4 py-3 text-left text-sm ${
            prefs.interestIn === item.id ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-200'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  ) : (
    <div className="flex flex-wrap gap-2 overflow-y-auto px-5 pb-8">
      {page === 'busco' && SEEKING.map(item => chip(item.label, prefs.seeking === item.id, () => onChange({ ...prefs, seeking: item.id })))}
      {page === 'idiomas' && LANGUAGES.map(item => chip(item, prefs.languages.includes(item), () => onChange({ ...prefs, languages: toggle(prefs.languages, item) })))}
      {page === 'zodiaco' && ZODIAC.map(item => chip(item, prefs.zodiac === item, () => onChange({ ...prefs, zodiac: prefs.zodiac === item ? '' : item })))}
      {page === 'familia' && FAMILY.map(item => chip(item, prefs.family === item, () => onChange({ ...prefs, family: prefs.family === item ? '' : item })))}
      {page === 'comunicacion' && COMMUNICATION.map(item => chip(item, prefs.communication.includes(item), () => onChange({ ...prefs, communication: toggle(prefs.communication, item) })))}
      {page === 'amor' && LOVE.map(item => chip(item, prefs.love.includes(item), () => onChange({ ...prefs, love: toggle(prefs.love, item) })))}
      {page === 'mascotas' && PETS.map(item => chip(item, prefs.pets.includes(item), () => onChange({ ...prefs, pets: toggle(prefs.pets, item) })))}
      {page === 'beber' && DRINKING.map(item => chip(item, prefs.drinking === item, () => onChange({ ...prefs, drinking: prefs.drinking === item ? '' : item })))}
      {page === 'fumar' && SMOKING.map(item => chip(item, prefs.smoking === item, () => onChange({ ...prefs, smoking: prefs.smoking === item ? '' : item })))}
      {page === 'redes' && SOCIALS.map(item => chip(item, prefs.socials === item, () => onChange({ ...prefs, socials: prefs.socials === item ? '' : item })))}
    </div>
  );

  const row = (id: ChipPage, label: string, value: string) => (
    <button
      key={id}
      onClick={() => setPage(id)}
      className="flex w-full items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-4 text-left"
    >
      <span>
        <span className="block text-xs text-slate-400">{label}</span>
        <span className="text-base font-semibold">{value}</span>
      </span>
      <span className="shrink-0 text-slate-400">›</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 sm:items-center">
      <div className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-slate-900 text-white sm:rounded-3xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold font-display">
            {page === 'main' ? 'Preferencias' : TITLES[page]}
          </h2>
          <button
            onClick={page === 'main' ? onClose : () => setPage('main')}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200"
          >
            {page === 'main' ? <X className="h-4 w-4" /> : 'Listo'}
          </button>
        </div>

        {page === 'main' ? (
          <div className="space-y-3 overflow-y-auto px-4 pb-8">
            <section className="rounded-2xl bg-slate-800/80 p-4">
              <p className="text-sm font-semibold">Tu universidad</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Solo ves gente de la universidad. Aquí no hay distancia ni ubicación.
              </p>
            </section>

            {row('interes', 'Interesado en', interestLabel)}

            <section className="rounded-2xl bg-slate-800/80 px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-base font-semibold">Rango de edad</p>
                <p className="text-sm text-slate-300">{prefs.ageMin} – {prefs.ageMax}</p>
              </div>
              <label className="block text-[11px] text-slate-400">
                Mínima
                <input
                  type="range"
                  min={18}
                  max={30}
                  value={prefs.ageMin}
                  onChange={event => {
                    const ageMin = Math.min(Number(event.target.value), prefs.ageMax);
                    onChange({ ...prefs, ageMin });
                  }}
                  className="mt-1 w-full accent-rose-500"
                />
              </label>
              <label className="mt-2 block text-[11px] text-slate-400">
                Máxima
                <input
                  type="range"
                  min={18}
                  max={30}
                  value={prefs.ageMax}
                  onChange={event => {
                    const ageMax = Math.max(Number(event.target.value), prefs.ageMin);
                    onChange({ ...prefs, ageMax });
                  }}
                  className="mt-1 w-full accent-rose-500"
                />
              </label>
            </section>

            {row('busco', 'Busco', seekingLabel)}
            {row('idiomas', 'Idiomas', summary(prefs.languages))}
            {row('zodiaco', 'Zodiaco', prefs.zodiac || 'Seleccionar')}
            {row('familia', 'Planes familiares', prefs.family || 'Seleccionar')}
            {row('comunicacion', 'Estilo de comunicación', summary(prefs.communication))}
            {row('amor', 'Estilo de amor', summary(prefs.love))}
            {row('mascotas', 'Mascotas', summary(prefs.pets))}
            {row('beber', 'Beber', prefs.drinking || 'Seleccionar')}
            {row('fumar', '¿Cada cuánto fumas?', prefs.smoking || 'Seleccionar')}
            {row('redes', 'Redes sociales', prefs.socials || 'Seleccionar')}
          </div>
        ) : chips}
      </div>
    </div>
  );
};
