import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  mustPick?: boolean;
  placeholder?: string;
};

function normalize(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const UniversitySearch: React.FC<Props> = ({
  value,
  onChange,
  options,
  required,
  mustPick,
  placeholder = 'Busca tu universidad'
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const matches = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return options.slice(0, 8);
    return options
      .filter(name => normalize(name).includes(needle))
      .slice(0, 8);
  }, [options, query]);

  const commit = (name: string) => {
    setQuery(name);
    onChange(name);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        required={required}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          if (blurTimer.current) window.clearTimeout(blurTimer.current);
          setOpen(true);
        }}
        onBlur={() => {
          blurTimer.current = window.setTimeout(() => {
            setOpen(false);
            const typed = query.trim();
            if (!mustPick) {
              onChange(typed);
              return;
            }
            const match = options.find(name => normalize(name) === normalize(typed));
            if (match) {
              setQuery(match);
              onChange(match);
              return;
            }
            setQuery(value);
            onChange(value);
          }, 150);
        }}
        onChange={event => {
          const next = event.target.value;
          setQuery(next);
          onChange(next);
          setOpen(true);
        }}
        className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-rose-400"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl">
          {matches.map(name => (
            <li key={name}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                onMouseDown={event => event.preventDefault()}
                onClick={() => commit(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && matches.length === 0 && (
        <p className="absolute z-20 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-400">
          {mustPick
            ? 'No hay coincidencias. Elige una universidad de la lista.'
            : 'No hay coincidencias. Puedes dejar el nombre escrito.'}
        </p>
      )}
    </div>
  );
};
