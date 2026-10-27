import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PhotoPicker, type PhotoSlot } from './PhotoPicker';
import { UniversitySearch } from './UniversitySearch';
import type { InterestIn } from '../types';

const SUGGESTED_INTERESTS = [
  'Tecnología', 'Anime & Manga', 'Café', 'Medicina', 'Robótica',
  'Fotografía', 'Cine de Arte', 'Ajedrez', 'Gimnasio', 'Taylor Swift',
  'Rock Indie', 'Senderismo', 'Gaming', 'Fútbol', 'Voleibol',
  'Diseño', 'Psicología', 'Filosofía', 'Música Latina', 'Libros'
];

export const RegisterModal: React.FC = () => {
  const { isRegisterOpen, setIsRegisterOpen, signUp, universities } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'mujer' | 'hombre' | ''>('');
  const [interestIn, setInterestIn] = useState<InterestIn | ''>('');
  const [university, setUniversity] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState(4);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>(['Tecnología', 'Café']);
  const [customInterest, setCustomInterest] = useState('');
  const [blindBio, setBlindBio] = useState('');
  const [blindIdealSpot, setBlindIdealSpot] = useState('');
  const [adult, setAdult] = useState(false);
  const [slots, setSlots] = useState<PhotoSlot[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isRegisterOpen) return null;

  const toggleInterest = (interest: string) => {
    setInterests(current =>
      current.includes(interest)
        ? current.filter(item => item !== interest)
        : current.length >= 8
          ? current
          : [...current, interest]
    );
  };

  const addCustom = () => {
    const value = customInterest.trim();
    if (!value) return;
    toggleInterest(value);
    setCustomInterest('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adult) {
      setError('Confirma que eres mayor de 18.');
      return;
    }
    if (slots.length === 0) {
      setError('Sube al menos una foto tuya.');
      return;
    }
    if (interests.length < 2) {
      setError('Selecciona al menos 2 intereses.');
      return;
    }
    if (!gender) {
      setError('Indica si eres hombre o mujer.');
      return;
    }
    if (!interestIn) {
      setError('Indica en quién estás interesado.');
      return;
    }
    if (!universities.some(name => name.toLowerCase() === university.trim().toLowerCase())) {
      setError('Elige una universidad de la lista.');
      return;
    }
    setBusy(true);
    setError('');
    const message = await signUp({
      name,
      age,
      phone,
      password,
      gender,
      interestIn,
      university,
      career,
      semester,
      bio,
      interests,
      blindBio,
      blindIdealSpot,
      adultConfirmed: true,
      photoFiles: slots.map(slot => slot.file).filter((file): file is File => !!file)
    });
    if (message) {
      setError(message);
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center">
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-slate-950 p-5 text-white sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display">Crear cuenta</h2>
          <button type="button" onClick={() => setIsRegisterOpen(false)} aria-label="Cerrar">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={event => void submit(event)} className="space-y-3">
          <PhotoPicker slots={slots} onChange={setSlots} />

          <label className="block text-xs font-semibold text-slate-300">
            Nombre completo *
            <input
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-300">
              Edad *
              <input
                type="number"
                min={18}
                max={35}
                required
                value={age}
                onChange={event => setAge(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Semestre *
              <input
                type="number"
                min={1}
                max={12}
                required
                value={semester}
                onChange={event => setSemester(Number(event.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Soy *</p>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {([
                { id: 'hombre' as const, label: 'Hombre' },
                { id: 'mujer' as const, label: 'Mujer' }
              ]).map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    gender === option.id
                      ? 'border-rose-400 bg-rose-500/20 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Interesado en *</p>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {([
                { id: 'hombres' as const, label: 'Hombres' },
                { id: 'mujeres' as const, label: 'Mujeres' },
                { id: 'todos' as const, label: 'Ambos' }
              ]).map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setInterestIn(option.id)}
                  className={`rounded-xl border px-2 py-2 text-sm font-semibold ${
                    interestIn === option.id
                      ? 'border-rose-400 bg-rose-500/20 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-xs font-semibold text-slate-300">
            Número / WhatsApp *
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              value={phone}
              placeholder="Ej. 3001234567"
              onChange={event => setPhone(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Contraseña *
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Universidad *
            <UniversitySearch
              required
              mustPick
              value={university}
              options={universities}
              onChange={setUniversity}
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Carrera *
            <input
              required
              value={career}
              onChange={event => setCareer(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Bio *
            <textarea
              required
              rows={3}
              value={bio}
              onChange={event => setBio(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>

          <div>
            <p className="text-xs font-semibold text-slate-300">Intereses (2 a 8) *</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[...new Set([...SUGGESTED_INTERESTS, ...interests])].map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    interests.includes(interest)
                      ? 'bg-rose-500 text-white'
                      : 'border border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={customInterest}
                onChange={event => setCustomInterest(event.target.value)}
                placeholder="Otro interés"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={addCustom}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold"
              >
                Agregar
              </button>
            </div>
          </div>

          <label className="block text-xs font-semibold text-slate-300">
            Frase para citas a ciegas
            <textarea
              rows={2}
              value={blindBio}
              onChange={event => setBlindBio(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Lugar ideal en el campus
            <input
              value={blindIdealSpot}
              onChange={event => setBlindIdealSpot(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
            />
          </label>

          <label className="flex items-start gap-2 rounded-xl border border-white/10 bg-slate-800/80 p-3 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={adult}
              onChange={event => setAdult(event.target.checked)}
              className="mt-0.5"
            />
            <span>
              Confirmo que tengo 18 años o más y que Campy me puede escribir por WhatsApp para pedirme la
              foto de mi cédula y de mi carné.
            </span>
          </label>

          {error && <p className="text-xs text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-rose-500 py-3.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? 'Subiendo tus fotos…' : 'Crear cuenta y pedir verificación'}
          </button>
        </form>
      </div>
    </div>
  );
};
