export type Show = {
  id: string
  title: string
  date: string
  description: string
  status: 'scheduled' | 'live' | 'archived'
}

export type Artist = {
  id: string
  name: string
  role: string
  bio: string
  photo_url?: string
  photo_fit: 'contain' | 'cover'
  show_id: string
}

export type ShowPhoto = {
  id: string
  show_id: string
  url: string
  sort_order: number
}

export type ArtistPhoto = {
  id: string
  artist_id: string
  url: string
  sort_order: number
}

export type Feedback = {
  id: string
  show_id: string | null
  rating_overall: number
  rating_content: number
  rating_acting: number
  rating_staging: number
  rating_audio: number
  duration_feedback: 'troppo-breve' | 'giusta' | 'troppo-lungo' | null
  rating_value: number | null
  rating_comfort: number | null
  recommend: 'si' | 'forse' | 'no' | null
  positive_aspects: string[]
  improvements: string | null
  email: string | null
  created_at: string
}

export type Video = {
  id: string
  show_id: string
  artist_id: string
  format: 'vertical' | 'horizontal'
  url: string
}

export type LedWallContent = {
  id: string
  text: string
  speed: number
  active: boolean
}