import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { uploadGroupCover } from '../lib/photos';
import { X, Users, ImagePlus } from 'lucide-react';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
];

export const CreateGroupModal: React.FC = () => {
  const { isCreateGroupOpen, setIsCreateGroupOpen, createGroup, currentUser } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(PRESET_COVERS[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Campus', 'Comunidad']);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  if (!isCreateGroupOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const pickCoverFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo puedes subir una foto de portada.');
      return;
    }
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverUrl('');
    setError('');
  };

  const pickPreset = (url: string) => {
    if (coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverUrl(url);
    setCoverPreview(url);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || busy) return;
    setBusy(true);
    setError('');
    let finalCover = coverUrl;
    if (coverFile) {
      const uploaded = await uploadGroupCover(currentUser.id, coverFile);
      if (uploaded.error || !uploaded.url) {
        setError(uploaded.error || 'No se pudo subir la portada.');
        setBusy(false);
        return;
      }
      finalCover = uploaded.url;
    }
    if (!finalCover || finalCover.startsWith('blob:')) {
      setError('Elige una foto de portada.');
      setBusy(false);
      return;
    }
    const saveError = await createGroup({
      name: name.trim(),
      description: description.trim(),
      category: 'Integración Campus',
      coverUrl: finalCover,
      tags: tags.length > 0 ? tags : ['Universitarios']
    });
    setBusy(false);
    if (saveError) setError(saveError);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsCreateGroupOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-400 mb-1">
          <Users className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Comunidad Universitaria</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Crear Nuevo Grupo</h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-5">
          Serás el administrador y podrás moderar mensajes, invitar compañeros y organizar actividades en el campus.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Grupo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej. Club de Robótica, Torneo de Smash, Fans de Cine..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción del Grupo *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explica de qué trata el grupo, horarios de reunión o temáticas que se discuten..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Cover photo selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Imagen de Portada</label>
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
              <img
                src={coverPreview}
                alt="Portada del grupo"
                className="h-32 w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2.5 text-xs font-semibold text-rose-100 hover:bg-rose-900/40"
            >
              <ImagePlus className="h-4 w-4" />
              Elegir del dispositivo
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={event => {
                pickCoverFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <p className="mt-2 text-[11px] text-slate-500">O elige una sugerida:</p>
            <div className="mt-1 flex gap-2 overflow-x-auto pb-2">
              {PRESET_COVERS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickPreset(url)}
                  className={`h-14 w-20 rounded-xl overflow-hidden ring-2 shrink-0 transition ${
                    !coverFile && coverUrl === url
                      ? 'ring-rose-500 scale-105'
                      : 'ring-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Cover ${i}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Etiquetas del Grupo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Escribe una etiqueta y presiona agregar..."
                className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 border border-slate-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-rose-300">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-950/60 transition hover:from-rose-600 hover:to-rose-700 disabled:opacity-60"
            >
              {busy ? 'Publicando…' : 'Publicar y Abrir Sala de Chat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
