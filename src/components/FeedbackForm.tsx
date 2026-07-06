'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show } from '@/src/lib/types'

function StarRating({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-3xl transition ${n <= value ? 'text-pink-500' : 'text-slate-600'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FeedbackForm() {
  const [shows, setShows] = useState<Show[]>([])
  const [showId, setShowId] = useState('')
  const [ratingShow, setRatingShow] = useState(0)
  const [ratingAccess, setRatingAccess] = useState(0)
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    supabase.from('shows').select('*').order('date', { ascending: false }).then(({ data }) => {
      if (data) setShows(data as Show[])
    })
  }, [])

  async function handleSubmit() {
    if (!ratingShow || !ratingAccess || wouldRecommend === null) {
      setError(true)
      return
    }
    setError(false)
    setSubmitting(true)
    const { error: err } = await supabase.from('feedback').insert({
      show_id: showId || null,
      rating_show: ratingShow,
      rating_venue_access: ratingAccess,
      would_recommend: wouldRecommend,
      review: review.trim(),
    })
    setSubmitting(false)
    if (!err) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-5xl mb-4">🎭</div>
          <h1 className="text-2xl font-bold text-pink-600 mb-2">Grazie per il tuo feedback!</h1>
          <p className="text-gray-400">La tua opinione ci aiuta a migliorare.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-lg mx-auto bg-slate-800 rounded-lg p-6 border-2 border-pink-600">
        <h1 className="text-2xl font-bold text-pink-600 mb-1 text-center">🎭 Com&apos;è andata?</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Racconta la tua esperienza a Teatro Italia — bastano 2 minuti
        </p>

        {error && (
          <div className="mb-4 bg-red-600 text-white p-3 rounded text-sm text-center">
            Compila valutazione spettacolo, accesso e se lo consiglieresti.
          </div>
        )}

        {shows.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-1">Spettacolo (facoltativo)</label>
            <select
              value={showId}
              onChange={e => setShowId(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-pink-400"
            >
              <option value="">-- Non specificato --</option>
              {shows.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>
        )}

        <StarRating value={ratingShow} onChange={setRatingShow} label="Come valuti lo spettacolo?" />
        <StarRating value={ratingAccess} onChange={setRatingAccess} label="Quanto è stato facile raggiungere il teatro?" />

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">Consiglieresti Teatro Italia?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setWouldRecommend(true)}
              className={`flex-1 py-2 rounded font-bold transition ${wouldRecommend === true ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-400'}`}
            >
              👍 Sì
            </button>
            <button
              type="button"
              onClick={() => setWouldRecommend(false)}
              className={`flex-1 py-2 rounded font-bold transition ${wouldRecommend === false ? 'bg-red-600 text-white' : 'bg-slate-700 text-gray-400'}`}
            >
              👎 No
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-1">Recensione (facoltativa)</label>
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={4}
            placeholder="Raccontaci di più..."
            className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-pink-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition disabled:opacity-50"
        >
          {submitting ? 'Invio…' : 'Invia Feedback'}
        </button>
      </div>
    </div>
  )
}
