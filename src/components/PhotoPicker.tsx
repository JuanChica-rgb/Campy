import React, { useRef } from 'react';
import { Plus, X } from 'lucide-react';

export type PhotoSlot = {
  id: string;
  preview: string;
  file?: File;
  remote?: string;
};

type Props = {
  slots: PhotoSlot[];
  onChange: (slots: PhotoSlot[]) => void;
  max?: number;
};

export const PhotoPicker: React.FC<Props> = ({ slots, onChange, max = 6 }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = [...slots];
    for (const file of Array.from(files)) {
      if (next.length >= max) break;
      if (!file.type.startsWith('image/')) continue;
      next.push({
        id: `local_${crypto.randomUUID()}`,
        preview: URL.createObjectURL(file),
        file
      });
    }
    onChange(next);
  };

  const removeAt = (index: number) => {
    const target = slots[index];
    if (target?.preview.startsWith('blob:')) URL.revokeObjectURL(target.preview);
    onChange(slots.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot, index) => (
          <div key={slot.id} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-800">
            <img src={slot.preview} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
              aria-label="Quitar foto"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold">
                Principal
              </span>
            )}
          </div>
        ))}
        {slots.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-600 bg-slate-800/60 text-slate-400"
          >
            <Plus className="h-5 w-5" />
            <span className="text-[11px] font-medium">Subir</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={event => {
          addFiles(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
};
