export type NameCategory = 'popularne' | 'nowoczesne' | 'rzadkie'

export interface FemaleName {
  name: string
  popularity: number
  meaning: string
  category: NameCategory
}

export type Vote = 'like' | 'dislike'

export interface FiltersState {
  letter: string
  category: 'wszystkie' | NameCategory
  popularityBand: 'wszystkie' | 'top100k+' | 'srednie20k-100k' | 'rzadkie<20k'
}
