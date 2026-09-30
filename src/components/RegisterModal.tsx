import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, Upload, Sparkles, Check, Phone, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';

const SUGGESTED_INTERESTS = [
  'Tecnología', 'Anime & Manga', 'Café', 'Medicina', 'Robótica',
  'Fotografía', 'Cine de Arte', 'Ajedrez', 'Gimnasio', 'Taylor Swift',
  'Rock Indie', 'Senderismo', 'Gaming', 'Fútbol', 'Voleibol',
  'Diseño', 'Psicología', 'Filosofía', 'Música Latina', 'Libros'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
];

export const RegisterModal: React.FC = () => {
  const { isRegisterOpen, setIsRegisterOpen, registerUser } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [phone, setPhone] = useState('+52 55 ');
  const [university, setUniversity] = useState('UNAM (Campus Central)');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState(4);
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Tecnología', 'Café']);
  const [blindBio, setBlindBio] = useState('');
  const [blindIdealSpot, setBlindIdealSpot] = useState('Cafetería central del campus');
  const [error, setError] = useState('');

  if (!isRegisterOpen) return null;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 8) return;
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (age < 18 || age > 35) {
      setError('Debes ser un estudiante universitario mayor de 18 años.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('El número telefónico es obligatorio para el proceso de auditoría por WhatsApp.');
      return;
    }
    if (!university.trim()) {
      setError('Por favor indica tu universidad.');
      return;
    }
    if (!career.trim()) {
      setError('Por favor indica tu carrera universitaria.');
      return;
    }
    if (!bio.trim()) {
      setError('Escribe una breve descripción (Bio).');
      return;
    }
    if (selectedInterests.length < 2) {
      setError('Selecciona al menos 2 intereses o etiquetas.');
      return;
    }

    setError('');
    registerUser({
      name: name.trim(),
      age: Number(age),
      phone: phone.trim(),
      university: university.trim(),
      career: career.trim(),
      semester: Number(semester),
      photoUrl,
      bio: bio.trim(),
      interests: selectedInterests,
      blindBio: blindBio.trim() || 'Me gusta compartir un buen café y platicar de cosas interesantes.',
      blindIdealSpot: blindIdealSpot.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 p-6 text-white shadow-2xl">
        {/* Close */}
        <button
          onClick={() => setIsRegisterOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Alta de Estudiante Universitario</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Únete a Campy</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Conecta con otros estudiantes de tu campus en citas, citas a ciegas y grupos.
          </p>
        </div>

        {/* Security Alert Banner (Mandatory requirement) */}
        <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">Aviso de seguridad y verificación</p>
            <p className="text-amber-200/90 leading-relaxed italic">
              "Buscamos garantizar un ambiente seguro entre estudiantes en centros universitarios. Tu cuenta pasará por un proceso de verificación antes de ser activada."
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Fotografía de Perfil (Obligatorio)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-2 ring-rose-500">
                <img src={photoUrl} alt="Avatar actual" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1.5">Elige un avatar o pega una URL de foto:</p>
                <div className="flex gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`h-9 w-9 rounded-xl overflow-hidden ring-2 transition ${
                        photoUrl === url ? 'ring-rose-500 scale-105' : 'ring-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <input
              type="text"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              placeholder="O pega aquí la URL de tu foto de perfil..."
              className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Ana Lucía Morales"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Edad *</label>
              <input
                type="number"
                min={18}
                max={40}
                required
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile phone (Compulsory for WhatsApp audit) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                Número de teléfono móvil (Obligatorio para WhatsApp) *
              </span>
              <span className="text-[10px] text-emerald-400">Auditoría externa</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Un moderador te contactará por WhatsApp para solicitar carné estudiantil vigente y selfie de confirmación.
            </p>
          </div>

          {/* University, Career, Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Universidad *</label>
              <input
                type="text"
                required
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="Ej. UNAM, Tec de Monterrey, UBA..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Semestre actual *</label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => (
                  <option key={s} value={s}>{s}º Semestre</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Carrera universitaria *</label>
            <input
              type="text"
              required
              value={career}
              onChange={e => setCareer(e.target.value)}
              placeholder="Ej. Ingeniería Mecatrónica, Psicología, Medicina..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción corta (Bio) *</label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="¿Qué te gusta hacer en tus ratos libres en campus? ¿Cómo sobrevives a los exámenes?..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Blind dating bio / spot prompt */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Preguntas para Modo Cita a Ciegas (Opcional)</span>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Lo que nadie sabe de mí / Mi plan ideal:</label>
              <input
                type="text"
                value={blindBio}
                onChange={e => setBlindBio(e.target.value)}
                placeholder="Ej. Puedo hablar horas de cine indie o debatir sobre inteligencia artificial..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Lugar público seguro en campus para encontrarse:</label>
              <input
                type="text"
                value={blindIdealSpot}
                onChange={e => setBlindIdealSpot(e.target.value)}
                placeholder="Ej. Cafetería central, mesas de la biblioteca..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Interests tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Intereses / Gustos / Etiquetas (Elige de 2 a 8) *</span>
              <span className="text-[11px] text-rose-400 font-bold">{selectedInterests.length}/8 seleccionados</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_INTERESTS.map(tag => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-950/60 hover:from-rose-600 hover:to-rose-700 transition active:scale-[0.98]"
            >
              Completar Registro y Solicitar Verificación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
