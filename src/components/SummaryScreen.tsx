import type { FemaleName } from '../types'

interface SummaryScreenProps {
  processedCount: number
  likeCount: number
  top: FemaleName[]
  onRestart: () => void
}

export function SummaryScreen({ processedCount, likeCount, top, onRestart }: SummaryScreenProps) {
  return (
    <section className="rounded-3xl bg-white/80 p-6 text-left shadow-xl ring-1 ring-rose-100 backdrop-blur sm:p-8">
      <h2 className="text-2xl font-bold text-rose-900">Podsumowanie</h2>
      <p className="mt-2 text-rose-800">
        Przetestowaliście {processedCount} imion, a {likeCount} z nich otrzymało ocenę "Pasuje".
      </p>

      <h3 className="mt-6 text-lg font-semibold text-rose-900">Top 10 faworytów</h3>
      <ol className="mt-3 space-y-2">
        {top.map((item, index) => (
          <li key={item.name} className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900">
            {index + 1}. <strong>{item.name}</strong> - {item.meaning}
          </li>
        ))}
      </ol>

      <button
        onClick={onRestart}
        className="mt-6 rounded-xl bg-rose-500 px-4 py-2 font-semibold text-white hover:bg-rose-600"
      >
        Wróć do wyboru imion
      </button>
    </section>
  )
}
