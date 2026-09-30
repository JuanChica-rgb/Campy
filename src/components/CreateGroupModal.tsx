import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GroupCategory } from '../types';

const CATEGORIES: GroupCategory[] = [
  'Anime & Otaku',
  'Robótica & Tech',
  'Integración Campus',
  'Deportes & Fitness',
  'Música & Arte',
  'Fiesta & Vida Nocturna',
  'Club de Lectura & Café'
];

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
  const [category, setCategory] = useState<GroupCategory>('Integración Campus');
  const [coverUrl, setCoverUrl] = useState(PRESET_COVERS[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Campus', 'Comunidad']);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    createGroup({
      name: name.trim(),
      description: description.trim(),
      category,
      coverUrl,
      tags: tags.length > 0 ? tags : ['Universitarios', category]
    });
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría Temática *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as GroupCategory)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            <div className="flex gap-2 overflow-x-auto pb-2">
              {PRESET_COVERS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCoverUrl(url)}
                  className={`h-14 w-20 rounded-xl overflow-hidden ring-2 shrink-0 transition ${
                    coverUrl === url ? 'ring-rose-500 scale-105' : 'ring-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Cover ${i}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              placeholder="O pega una URL de imagen..."
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-950/60 hover:from-rose-600 hover:to-rose-700 transition"
            >
              Publicar y Abrir Sala de Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
