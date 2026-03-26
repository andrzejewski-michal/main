import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import type { FemaleName } from '../types'

interface NameCardProps {
  currentName?: FemaleName
  isFinalChoice: boolean
  onLike: () => void
  onDislike: () => void
  onSkip: () => void
}

export function NameCard({ currentName, isFinalChoice, onLike, onDislike, onSkip }: NameCardProps) {
  const handlers = useSwipeable({
    onSwipedLeft: onDislike,
    onSwipedRight: onLike,
    onSwipedUp: onSkip,
    trackMouse: true,
  })

  const subtitle = useMemo(() => {
    if (!currentName) return ''
    return `Popularność: ${currentName.popularity.toLocaleString('pl-PL')} | Kategoria: ${currentName.category}`
  }, [currentName])

  return (
    <section {...handlers} className="w-full rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-rose-100 backdrop-blur sm:p-8">
      <AnimatePresence mode="wait">
        {currentName ? (
          <motion.div
            key={currentName.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="text-sm text-rose-600">Przesuń: lewo = nie pasuje, prawo = pasuje, góra = pomiń</p>
            {isFinalChoice && (
              <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                Zostało już tylko jedno imię.
              </p>
            )}
            <h1 className="text-5xl font-extrabold tracking-tight text-rose-900 sm:text-6xl">{currentName.name}</h1>
            <p className="text-base text-rose-700">{subtitle}</p>
            <p className="text-sm text-rose-800">Znaczenie: {currentName.meaning}</p>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 py-8">
            <h2 className="text-2xl font-bold text-rose-900">Brak imion do dalszego wyboru</h2>
            <p className="text-rose-700">Wszystkie imiona zostały odrzucone. Użyj przycisku reset.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          onClick={onLike}
          disabled={!currentName || isFinalChoice}
          className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pasuje 👍
        </button>
        <button
          onClick={onSkip}
          disabled={!currentName || isFinalChoice}
          className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-amber-900 shadow hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Pomiń ⏭️
        </button>
        <button
          onClick={onDislike}
          disabled={!currentName || isFinalChoice}
          className="rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white shadow hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Nie pasuje 👎
        </button>
      </div>
    </section>
  )
}
