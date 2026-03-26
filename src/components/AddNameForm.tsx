import { useMemo, useState, type FormEvent } from 'react'
import type { FemaleName, NameCategory } from '../types'

const CATEGORY_OPTIONS: Array<{ value: NameCategory; label: string }> = [
  { value: 'popularne', label: 'Popularne' },
  { value: 'nowoczesne', label: 'Nowoczesne' },
  { value: 'rzadkie', label: 'Rzadkie' },
]

type PopularityBand = 'top100k+' | 'srednie20k-100k' | 'rzadkie<20k'

const POP_BANDS: Array<{ value: PopularityBand; label: string; popularity: number }> = [
  { value: 'top100k+', label: '100k+' , popularity: 150000 },
  { value: 'srednie20k-100k', label: '20k - 100k', popularity: 50000 },
  { value: 'rzadkie<20k', label: '< 20k', popularity: 8000 },
]

interface AddNameFormProps {
  onAdd: (name: FemaleName) => { ok: boolean; message?: string }
  existingLetters?: string[]
}

export function AddNameForm({ onAdd }: AddNameFormProps) {
  const [name, setName] = useState('')
  const [meaning, setMeaning] = useState('')
  const [category, setCategory] = useState<NameCategory>('popularne')
  const [band, setBand] = useState<PopularityBand>('srednie20k-100k')
  const [message, setMessage] = useState<string | null>(null)

  const selectedPopularity = useMemo(() => POP_BANDS.find((b) => b.value === band)?.popularity ?? 50000, [band])

  const submit = (e: FormEvent) => {
    e.preventDefault()

    const trimmed = name.trim().replace(/\s+/g, ' ')
    if (!trimmed) {
      setMessage('Podaj imię.')
      return
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿŁłŚśŻżŹźĆćŃńÓóĘęĄą]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿŁłŚśŻżŹźĆćŃńÓóĘęĄą]+)*$/.test(trimmed)) {
      setMessage('Imię wygląda na niepoprawne (dozwolone litery i spacje).')
      return
    }

    const newItem: FemaleName = {
      name: trimmed,
      popularity: selectedPopularity,
      meaning: meaning.trim() || 'Dodane przez rodziców',
      category,
    }

    const res = onAdd(newItem)
    if (!res.ok) {
      setMessage(res.message ?? 'Nie udało się dodać imienia.')
      return
    }

    setName('')
    setMeaning('')
    setCategory('popularne')
    setBand('srednie20k-100k')
    setMessage('Dodano imię do listy.')
  }

  return (
    <section className="rounded-2xl bg-white/75 p-4 ring-1 ring-rose-100 backdrop-blur">
      <h2 className="mb-3 text-lg font-bold text-rose-900">Dodaj imię</h2>

      <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1 text-sm text-rose-800">
          <span>Imię</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Np. Emilka"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          />
        </label>

        <label className="block space-y-1 text-sm text-rose-800">
          <span>Znaczenie (opcjonalnie)</span>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="Np. 'pilna'"
            className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 text-sm text-rose-800">
            <span>Kategoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NameCategory)}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1 text-sm text-rose-800">
            <span>Popularność (dla filtrów)</span>
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as PopularityBand)}
              className="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 outline-none focus:border-rose-400"
            >
              {POP_BANDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message && <p className="text-sm font-medium text-rose-800">{message}</p>}

        <button type="submit" className="w-full rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-600">
          Dodaj do listy
        </button>
      </form>
    </section>
  )
}
