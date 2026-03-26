import type { FemaleName } from '../types'

interface FavoritesListProps {
  favorites: FemaleName[]
  title?: string
  onRemove: (name: string) => void
  onExportJson: () => void
  onExportText: () => void
}

export function FavoritesList({
  favorites,
  title = 'Pasuje',
  onRemove,
  onExportJson,
  onExportText,
}: FavoritesListProps) {
  return (
    <section className="rounded-2xl bg-white/75 p-4 ring-1 ring-rose-100 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-rose-900">
          {title} ({favorites.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onExportJson}
            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
          >
            Eksport JSON
          </button>
          <button
            onClick={onExportText}
            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
          >
            Eksport TXT
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <p className="text-sm text-rose-700">Brak zapisanych imion. Kliknij `Pasuje` albo `Pomiń`, by dodać.</p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-auto pr-1">
          {favorites.map((item) => (
            <li
              key={item.name}
              className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong>{item.name}</strong>
                  <div className="mt-1 text-xs text-rose-700">
                    Popularność: {item.popularity.toLocaleString('pl-PL')}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-rose-800">{item.meaning}</div>
                </div>
                <button
                  onClick={() => onRemove(item.name)}
                  className="rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
