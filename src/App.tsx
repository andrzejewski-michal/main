import { useEffect, useMemo, useState } from 'react'
import Confetti from 'react-confetti'
import { AddNameForm } from './components/AddNameForm'
import { FavoritesList } from './components/FavoritesList'
import { Filters } from './components/Filters'
import { NameCard } from './components/NameCard'
import { FEMALE_NAMES } from './data/femaleNames'
import type { FemaleName, FiltersState } from './types'

type Decision = 'like' | 'skip' | 'dislike'

const STORAGE_KEY = 'name-picker-pl-v3'
const USER_NAMES_KEY = 'name-picker-pl-user-names-v1'

const defaultFilters: FiltersState = {
  letter: 'Wszystkie',
  category: 'wszystkie',
  popularityBand: 'wszystkie',
}

interface PersistedState {
  decisions: Record<string, Decision>
  currentNameKey: string | null
  filters: FiltersState
  search: string
}

function readPersistedState(): PersistedState | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as PersistedState
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function readUserNames(): FemaleName[] {
  const raw = localStorage.getItem(USER_NAMES_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as FemaleName[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(USER_NAMES_KEY)
    return []
  }
}

function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export default function App() {
  const persisted = readPersistedState()

  const [userNames, setUserNames] = useState<FemaleName[]>(() => readUserNames())

  const [decisions, setDecisions] = useState<Record<string, Decision>>(persisted?.decisions ?? {})
  const [currentNameKey, setCurrentNameKey] = useState<string | null>(persisted?.currentNameKey ?? null)
  const [filters, setFilters] = useState<FiltersState>(persisted?.filters ?? defaultFilters)
  const [search, setSearch] = useState(persisted?.search ?? '')

  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    localStorage.setItem(USER_NAMES_KEY, JSON.stringify(userNames))
  }, [userNames])

  const allNames = useMemo(() => {
    const byKey = new Map<string, FemaleName>()

    // Najpierw trzymamy oficjalne imiona, a duplikaty (case-insensitive) z user-names pomijamy.
    for (const item of FEMALE_NAMES) {
      const key = item.name.trim().toLowerCase()
      byKey.set(key, item)
    }

    for (const item of userNames) {
      const key = item.name.trim().toLowerCase()
      if (!byKey.has(key)) byKey.set(key, item)
    }

    return [...byKey.values()]
  }, [userNames])

  const alphabet = useMemo(() => {
    const letters = Array.from(new Set(allNames.map((n) => n.name[0]).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'pl'))
    return ['Wszystkie', ...letters]
  }, [allNames])

  useEffect(() => {
    const data: PersistedState = {
      decisions,
      currentNameKey,
      filters,
      search,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [decisions, currentNameKey, filters, search])

  const filteredPool = useMemo(() => {
    return allNames.filter((item) => {
      if (filters.letter !== 'Wszystkie' && item.name[0] !== filters.letter) return false
      if (filters.category !== 'wszystkie' && item.category !== filters.category) return false
      if (search.trim() && !item.name.toLowerCase().includes(search.toLowerCase())) return false

      if (filters.popularityBand === 'top100k+') return item.popularity >= 100000
      if (filters.popularityBand === 'srednie20k-100k') return item.popularity >= 20000 && item.popularity < 100000
      if (filters.popularityBand === 'rzadkie<20k') return item.popularity < 20000

      return true
    })
  }, [allNames, filters, search])

  const nonDislikedPool = useMemo(() => {
    // Imiona oznaczone jako `Nie pasuje` nigdy nie wracają do listy.
    return filteredPool.filter((item) => decisions[item.name] !== 'dislike')
  }, [filteredPool, decisions])

  const undecidedPool = useMemo(() => {
    // Podczas pierwszego przebiegu pokazujemy tylko imiona bez decyzji.
    return nonDislikedPool.filter((item) => decisions[item.name] === undefined)
  }, [nonDislikedPool, decisions])

  const remainingPool = useMemo(() => {
    // Gdy nie ma już niezdecydowanych, startujemy od nowa z `pominiete` i `pasujace`.
    return undecidedPool.length > 0 ? undecidedPool : nonDislikedPool
  }, [nonDislikedPool, undecidedPool])

  const activeName = useMemo(() => {
    if (remainingPool.length === 0) return undefined

    const preferred = currentNameKey
      ? remainingPool.find((item) => item.name === currentNameKey)
      : undefined

    return preferred ?? remainingPool[0]
  }, [remainingPool, currentNameKey])

  const savedNames = useMemo(() => {
    return allNames.filter((item) => decisions[item.name] === 'like' || decisions[item.name] === 'skip')
  }, [allNames, decisions])

  const likedNames = useMemo(() => {
    return allNames.filter((item) => decisions[item.name] === 'like')
  }, [allNames, decisions])

  const applyDecision = (decision: Decision) => {
    if (!activeName || nonDislikedPool.length <= 1) return

    const currentName = activeName.name
    const wasFirstRound = undecidedPool.length > 0
    const nextDecisions = { ...decisions, [currentName]: decision }

    if (decision === 'like') {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1200)
    }

    const afterNonDisliked = filteredPool.filter((item) => nextDecisions[item.name] !== 'dislike')
    const afterUndecided = afterNonDisliked.filter((item) => nextDecisions[item.name] === undefined)
    const afterRemaining = afterUndecided.length > 0 ? afterUndecided : afterNonDisliked

    if (afterRemaining.length === 0) return

    // Jeśli właśnie skończył się pierwszy przebieg (nie ma już niezdecydowanych),
    // to uruchamiamy listę od początku kolejności.
    if (wasFirstRound && afterUndecided.length === 0) {
      setDecisions(nextDecisions)
      setCurrentNameKey(afterRemaining[0].name)
      return
    }

    // Wybieramy kolejne imię w kolejności z `filteredPool`, cyklicznie po aktualnej pozycji.
    const afterRemainingSet = new Set(afterRemaining.map((n) => n.name))
    const startIndex = filteredPool.findIndex((n) => n.name === currentName)

    const nextNameKey = (() => {
      if (startIndex === -1) return afterRemaining[0].name
      for (let step = 1; step <= filteredPool.length; step++) {
        const candidate = filteredPool[(startIndex + step) % filteredPool.length]
        if (afterRemainingSet.has(candidate.name)) return candidate.name
      }
      return afterRemaining[0].name
    })()

    setDecisions(nextDecisions)
    setCurrentNameKey(nextNameKey)
  }

  const onRemoveSaved = (name: string) => {
    // Usunięcie z listy oznacza, że wraca do puli jako "pominiete" (nie znika na stałe).
    setDecisions((prev) => ({ ...prev, [name]: 'skip' }))
  }

  const exportJson = () => {
    downloadFile('zapisane-imiona.json', JSON.stringify(savedNames, null, 2), 'application/json')
  }

  const exportTxt = () => {
    const content = savedNames
      .map((item, index) => `${index + 1}. ${item.name} - ${item.meaning}`)
      .join('\n')

    downloadFile('zapisane-imiona.txt', content, 'text/plain;charset=utf-8')
  }

  const resetAll = () => {
    setDecisions({})
    setCurrentNameKey(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const dislikedCount = Object.values(decisions).filter((d) => d === 'dislike').length

  const addNameToList = (nameItem: FemaleName): { ok: boolean; message?: string } => {
    const trimmed = nameItem.name.trim().replace(/\s+/g, ' ')
    if (!trimmed) return { ok: false, message: 'Podaj imię.' }

    const formatted = trimmed
      .split(' ')
      .map((word) => {
        if (!word) return word
        const first = word.charAt(0).toLocaleUpperCase('pl-PL')
        const rest = word.slice(1).toLocaleLowerCase('pl-PL')
        return `${first}${rest}`
      })
      .join(' ')

    const key = formatted.toLowerCase()
    const existing = new Set(allNames.map((n) => n.name.trim().toLowerCase()))

    if (existing.has(key)) {
      return { ok: false, message: 'To imię już istnieje na liście.' }
    }

    setUserNames((prev) => [
      ...prev,
      {
        ...nameItem,
        name: formatted,
        meaning: nameItem.meaning.trim() || 'Dodane przez rodziców',
      },
    ])

    return { ok: true }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-rose-100 px-4 py-4 text-rose-900 sm:px-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={160} />}

      <div className="mx-auto w-full max-w-6xl space-y-4">
        <header className="rounded-2xl bg-white/75 p-4 ring-1 ring-rose-100 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-rose-900">Wybór imienia - wspólna decyzja rodziców</h1>
              <p className="text-sm text-rose-700">
                Zostało: {remainingPool.length} | Odrzucone: {dislikedCount} | Zapisane: {savedNames.length}
              </p>
            </div>

            <button
              onClick={resetAll}
              className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              Reset
            </button>
          </div>
        </header>

        {nonDislikedPool.length === 1 && likedNames.length === 1 ? (
          <section className="rounded-2xl bg-emerald-100 p-4 text-emerald-800 ring-1 ring-emerald-200">
            <p className="font-semibold">
              Finał: zostało jedno imię oznaczone jako `Pasuje` - <span className="text-xl">{likedNames[0].name}</span>
            </p>
          </section>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <NameCard
              currentName={activeName}
              isFinalChoice={nonDislikedPool.length <= 1}
              onLike={() => applyDecision('like')}
              onSkip={() => applyDecision('skip')}
              onDislike={() => applyDecision('dislike')}
            />

            <section className="rounded-2xl bg-white/75 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
              <p>
                Głosuj wspólnie. Po wyborze imię jest usuwane z obiegu i nie pojawia się ponownie. Program kręci listę aż
                zostanie jedno imię.
              </p>
            </section>
          </div>

          <div className="space-y-4">
            <Filters
              filters={filters}
              search={search}
              onSearchChange={setSearch}
              onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
              alphabet={alphabet}
            />

            <AddNameForm onAdd={addNameToList} />

            <FavoritesList
              favorites={savedNames}
              title="Zapisane imiona"
              onRemove={onRemoveSaved}
              onExportJson={exportJson}
              onExportText={exportTxt}
            />

            {likedNames.length > 0 ? (
              <section className="rounded-2xl bg-white/75 p-4 ring-1 ring-rose-100">
                <h2 className="mb-2 text-lg font-bold text-rose-900">Imiona: `Pasuje`</h2>
                <p className="text-sm text-rose-700">{likedNames.map((item) => item.name).join(', ')}</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
