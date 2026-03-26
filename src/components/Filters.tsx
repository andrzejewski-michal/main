import type { FiltersState } from '../types'

interface FiltersProps {
  filters: FiltersState
  search: string
  onSearchChange: (value: string) => void
  onChange: (patch: Partial<FiltersState>) => void
  alphabet: string[]
}

export function Filters({ filters, search, onSearchChange, onChange, alphabet }: FiltersProps) {
  return (
    <section className="rounded-2xl bg-white/75 p-4 ring-1 ring-rose-100 backdrop-blur">
      <h2 className="mb-3 text-lg font-bold text-rose-900">Filtruj</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-rose-800">
          <span>Wyszukiwarka</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Np. Zofia"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          />
        </label>

        <label className="space-y-1 text-sm text-rose-800">
          <span>Pierwsza litera</span>
          <select
            value={filters.letter}
            onChange={(event) => onChange({ letter: event.target.value })}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          >
            {alphabet.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-rose-800">
          <span>Popularność</span>
          <select
            value={filters.popularityBand}
            onChange={(event) => onChange({ popularityBand: event.target.value as FiltersState['popularityBand'] })}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          >
            <option value="wszystkie">Wszystkie</option>
            <option value="top100k+">Bardzo popularne (100k+)</option>
            <option value="srednie20k-100k">Średnie (20k - 100k)</option>
            <option value="rzadkie&lt;20k">Rzadkie (&lt;20k)</option>
          </select>
        </label>

        <label className="space-y-1 text-sm text-rose-800">
          <span>Typ</span>
          <select
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value as FiltersState['category'] })}
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          >
            <option value="wszystkie">Wszystkie</option>
            <option value="popularne">Popularne</option>
            <option value="nowoczesne">Nowoczesne</option>
            <option value="rzadkie">Rzadkie</option>
          </select>
        </label>
      </div>
    </section>
  )
}
