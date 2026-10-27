import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhotoPicker, type PhotoSlot } from './PhotoPicker';
import { PlusSheet } from './PlusSheet';
import { UniversitySearch } from './UniversitySearch';
import { BrandMark } from './BrandMark';
import { uploadProfilePhoto } from '../lib/photos';
import { hasPlus } from '../lib/plus';

const INTERESTS = [
  'Tecnología', 'Anime & Manga', 'Café', 'Medicina', 'Robótica',
  'Fotografía', 'Cine de Arte', 'Ajedrez', 'Gimnasio', 'Taylor Swift',
  'Rock Indie', 'Senderismo', 'Gaming', 'Fútbol', 'Voleibol',
  'Diseño', 'Psicología', 'Filosofía', 'Música Latina', 'Libros'
];

function slotsFromUser(photoUrl: string, additional: string[] = []): PhotoSlot[] {
  return [photoUrl, ...additional]
    .filter(Boolean)
    .map(url => ({ id: url, preview: url, remote: url }));
}

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, signOut, deleteAccount, universities, discovery, setDiscovery } =
    useApp();
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [gender, setGender] = useState<'mujer' | 'hombre' | ''>(currentUser.gender ?? '');
  const [interestIn, setInterestIn] = useState(discovery.interestIn);
  const [university, setUniversity] = useState(currentUser.university);
  const [career, setCareer] = useState(currentUser.career);
  const [semester, setSemester] = useState(currentUser.semester);
  const [bio, setBio] = useState(currentUser.bio);
  const [slots, setSlots] = useState<PhotoSlot[]>(() =>
    slotsFromUser(currentUser.photoUrl, currentUser.additionalPhotos)
  );
  const [interests, setInterests] = useState(currentUser.interests);
  const [blindBio, setBlindBio] = useState(currentUser.blindBio ?? '');
  const [blindIdealSpot, setBlindIdealSpot] = useState(currentUser.blindIdealSpot ?? '');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [plusOpen, setPlusOpen] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(!!currentUser.privateProfile);

  useEffect(() => {
    setName(currentUser.name);
    setAge(currentUser.age);
    setGender(currentUser.gender ?? '');
    setInterestIn(discovery.interestIn);
    setUniversity(currentUser.university);
    setCareer(currentUser.career);
    setSemester(currentUser.semester);
    setBio(currentUser.bio);
    setSlots(slotsFromUser(currentUser.photoUrl, currentUser.additionalPhotos));
    setInterests(currentUser.interests);
    setBlindBio(currentUser.blindBio ?? '');
    setBlindIdealSpot(currentUser.blindIdealSpot ?? '');
    setPrivateProfile(!!currentUser.privateProfile);
    setSaved(false);
  }, [currentUser.id, currentUser.gender, discovery.interestIn]);

  const toggleInterest = (interest: string) => {
    setSaved(false);
    setInterests(current =>
      current.includes(interest)
        ? current.filter(item => item !== interest)
        : current.length >= 8
          ? current
          : [...current, interest]
    );
  };

  const save = async () => {
    if (!name.trim() || !career.trim() || !bio.trim() || busy) return;
    if (!gender) {
      setError('Indica si eres hombre o mujer.');
      return;
    }
    if (slots.length === 0) {
      setError('Sube al menos una foto.');
      return;
    }
    setBusy(true);
    setError('');
    const urls: string[] = [];
    for (const slot of slots) {
      if (slot.file) {
        const uploaded = await uploadProfilePhoto(currentUser.id, slot.file);
        if (uploaded.error || !uploaded.url) {
          setError(uploaded.error || 'No se pudo subir la foto.');
          setBusy(false);
          return;
        }
        urls.push(uploaded.url);
      } else if (slot.remote) {
        urls.push(slot.remote);
      }
    }
    updateProfile({
      name: name.trim(),
      age,
      gender,
      interestIn,
      university: university.trim(),
      career: career.trim(),
      semester,
      bio: bio.trim(),
      photoUrl: urls[0],
      additionalPhotos: urls.slice(1),
      interests,
      blindBio: blindBio.trim(),
      blindIdealSpot: blindIdealSpot.trim(),
      privateProfile
    });
    setDiscovery({ ...discovery, interestIn });
    setSlots(slotsFromUser(urls[0], urls.slice(1)));
    setSaved(true);
    setBusy(false);
  };

  return (
    <div className="mx-auto h-full w-full max-w-lg overflow-y-auto px-4 py-4 md:max-w-2xl md:py-8">
      <div className="mb-4 flex items-center gap-3">
        <BrandMark size={44} />
        <div>
          <p className="font-display text-lg font-bold text-white">Campy</p>
          <p className="text-xs text-slate-400">Configuración de perfil</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPlusOpen(true)}
        className="mb-4 w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-left"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Campy Plus</p>
        <p className="mt-1 text-sm font-semibold text-white">
          {hasPlus(currentUser)
            ? 'Plus activo: likes, Super Like, mensaje y devolver.'
            : 'Ver likes, Super Like, mensaje y devolver.'}
        </p>
      </button>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
        <div className="space-y-4 p-4">
          <PhotoPicker slots={slots} onChange={next => { setSlots(next); setSaved(false); }} />

          <label className="block text-xs text-slate-400">
            Nombre
            <input
              value={name}
              onChange={event => { setName(event.target.value); setSaved(false); }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs text-slate-400">
              Edad
              <input
                type="number"
                min={18}
                max={35}
                value={age}
                onChange={event => { setAge(Number(event.target.value)); setSaved(false); }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-slate-400">
              Semestre
              <input
                type="number"
                min={1}
                max={12}
                value={semester}
                onChange={event => { setSemester(Number(event.target.value)); setSaved(false); }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>
          <div>
            <p className="text-xs text-slate-400">Soy</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {([
                { id: 'hombre' as const, label: 'Hombre' },
                { id: 'mujer' as const, label: 'Mujer' }
              ]).map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => { setGender(option.id); setSaved(false); }}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    gender === option.id
                      ? 'border-rose-400 bg-rose-500/20 text-white'
                      : 'border-white/10 bg-slate-800 text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400">Interesado en</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {([
                { id: 'hombres' as const, label: 'Hombres' },
                { id: 'mujeres' as const, label: 'Mujeres' },
                { id: 'todos' as const, label: 'Ambos' }
              ]).map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => { setInterestIn(option.id); setSaved(false); }}
                  className={`rounded-xl border px-2 py-2 text-sm font-semibold ${
                    interestIn === option.id
                      ? 'border-rose-400 bg-rose-500/20 text-white'
                      : 'border-white/10 bg-slate-800 text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-xs text-slate-400">
            Universidad
            <UniversitySearch
              mustPick
              value={university}
              options={[
                ...universities,
                ...(university && !universities.includes(university) ? [university] : [])
              ]}
              onChange={next => {
                setUniversity(next);
                setSaved(false);
              }}
            />
          </label>
          <label className="block text-xs text-slate-400">
            Carrera
            <input
              value={career}
              onChange={event => { setCareer(event.target.value); setSaved(false); }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs text-slate-400">
            Bio
            <textarea
              value={bio}
              onChange={event => { setBio(event.target.value); setSaved(false); }}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </label>

          <div>
            <p className="text-xs text-slate-400">Intereses</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set([...interests, ...INTERESTS])].map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    interests.includes(interest)
                      ? 'border-white bg-white text-slate-900'
                      : 'border-white/15 text-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-xs text-slate-400">
            Frase para citas a ciegas
            <textarea
              value={blindBio}
              onChange={event => { setBlindBio(event.target.value); setSaved(false); }}
              rows={2}
              className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs text-slate-400">
            Lugar en el campus
            <input
              value={blindIdealSpot}
              onChange={event => { setBlindIdealSpot(event.target.value); setSaved(false); }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-3">
            <button
              type="button"
              onClick={() => {
                const next = !privateProfile;
                setPrivateProfile(next);
                setSaved(false);
                updateProfile({ privateProfile: next });
              }}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left ${
                privateProfile
                  ? 'border-rose-400 bg-rose-500/20'
                  : 'border-white/10 bg-slate-900'
              }`}
            >
              <span>
                <span className="block text-sm font-semibold text-white">Perfil privado</span>
                <span className="block text-[11px] text-slate-400">
                  {privateProfile ? 'Activado' : 'Desactivado'}
                </span>
              </span>
              <span
                className={`relative h-6 w-11 rounded-full ${privateProfile ? 'bg-rose-500' : 'bg-slate-600'}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    privateProfile ? 'left-5' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
            {privateProfile && (
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                Si pones tu perfil en privado no harás match y nadie verá tu perfil. En los chats
                grupales aparecerás como Anónimo. Las personas con las que ya tienes conversaciones
                te podrán ver normal.
              </p>
            )}
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="w-full rounded-xl bg-rose-500 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? 'Guardando…' : saved ? 'Guardado' : 'Guardar perfil'}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-slate-300"
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              if (!confirm('¿Eliminar tu cuenta y tus datos de Campy? Esto no se puede deshacer.')) return;
              void deleteAccount(currentUser.id).then(message => {
                if (message) setError(message);
              });
            }}
            className="w-full rounded-xl border border-rose-500/30 py-2.5 text-xs font-semibold text-rose-300"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>

      {plusOpen && <PlusSheet onClose={() => setPlusOpen(false)} />}
    </div>
  );
};
