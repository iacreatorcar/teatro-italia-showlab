'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

const POSITIVE_ASPECTS = [
  'Recitazione straordinaria',
  'Scenografia e allestimento',
  'Colonna sonora e musica',
  'Trama innovativa',
  'Effetti tecnici',
  'Emozioni suscitate',
]

function RatingScale({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-2.5 justify-between mb-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-11 h-11 rounded border-2 font-bold transition ${
            value === n
              ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
              : 'border-[#d4af37]/50 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

function Question({ number, text, hint, children }: { number: number; text: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-9">
      <div className="font-bold mb-4 text-[15px]">
        <span className="text-[#d4af37] mr-1">{number}.</span>
        {text}
      </div>
      {children}
      {hint && <small className="text-gray-500">{hint}</small>}
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }: { name: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center p-2.5 bg-white/[0.02] rounded cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="mr-3 w-[18px] h-[18px] cursor-pointer"
          />
          <span className="text-gray-400">{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export default function FeedbackForm() {
  const [ratingOverall, setRatingOverall] = useState(0)
  const [ratingContent, setRatingContent] = useState(0)
  const [ratingActing, setRatingActing] = useState(0)
  const [ratingStaging, setRatingStaging] = useState(0)
  const [ratingAudio, setRatingAudio] = useState(0)
  const [duration, setDuration] = useState('')
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComfort, setRatingComfort] = useState(0)
  const [recommend, setRecommend] = useState('')
  const [aspects, setAspects] = useState<string[]>([])
  const [improvements, setImprovements] = useState('')
  const [email, setEmail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  function toggleAspect(a: string) {
    setAspects(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!ratingOverall || !ratingContent || !ratingActing || !ratingStaging || !ratingAudio) {
      setError(true)
      return
    }
    setError(false)
    setSubmitting(true)
    const { error: err } = await supabase.from('feedback').insert({
      rating_overall: ratingOverall,
      rating_content: ratingContent,
      rating_acting: ratingActing,
      rating_staging: ratingStaging,
      rating_audio: ratingAudio,
      duration_feedback: duration || null,
      rating_value: ratingValue || null,
      rating_comfort: ratingComfort || null,
      recommend: recommend || null,
      positive_aspects: aspects,
      improvements: improvements.trim() || null,
      email: email.trim() || null,
    })
    setSubmitting(false)
    if (!err) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 text-center text-[#eee]"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <div>
          <div className="text-5xl mb-4">🎭</div>
          <h1 className="text-2xl font-bold text-[#d4af37] mb-2">Grazie per il tuo feedback!</h1>
          <p className="text-gray-400">La tua opinione ci aiuta a migliorare.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-10 px-5 text-[#eee]"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      <div className="max-w-xl mx-auto bg-white/5 border border-[#d4af37]/30 rounded-lg p-8 md:p-10">
        <div className="text-center mb-10">
          <h1 className="text-[#d4af37] text-2xl font-bold mb-2">🎭 Feedback Spettacolo</h1>
          <p className="text-gray-400 text-sm">La tua opinione è preziosa. Grazie per aver partecipato!</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-600 text-white p-3 rounded text-sm text-center">
            Compila almeno le prime 5 valutazioni.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Question number={1} text="Valuta complessivamente lo spettacolo" hint="1 = Scarso | 5 = Eccellente">
            <RatingScale value={ratingOverall} onChange={setRatingOverall} />
          </Question>

          <Question number={2} text="Il contenuto e la trama ti hanno interessato?">
            <RatingScale value={ratingContent} onChange={setRatingContent} />
          </Question>

          <Question number={3} text="Qualità della recitazione e delle performance artistiche">
            <RatingScale value={ratingActing} onChange={setRatingActing} />
          </Question>

          <Question number={4} text="Scenografia, luci ed effetti tecnici">
            <RatingScale value={ratingStaging} onChange={setRatingStaging} />
          </Question>

          <Question number={5} text="Qualità audio e musica">
            <RatingScale value={ratingAudio} onChange={setRatingAudio} />
          </Question>

          <Question number={6} text="La durata dello spettacolo era appropriata?">
            <RadioGroup
              name="durata"
              value={duration}
              onChange={setDuration}
              options={[
                { value: 'troppo-breve', label: 'Troppo breve' },
                { value: 'giusta', label: 'Giusta' },
                { value: 'troppo-lungo', label: 'Troppo lungo' },
              ]}
            />
          </Question>

          <Question number={7} text="Ritieni il prezzo del biglietto coerente con la qualità?">
            <RatingScale value={ratingValue} onChange={setRatingValue} />
          </Question>

          <Question number={8} text="Comfort della sala (sedili, temperatura, visibilità)">
            <RatingScale value={ratingComfort} onChange={setRatingComfort} />
          </Question>

          <Question number={9} text="Consiglieresti questo spettacolo ad amici/familiari?">
            <RadioGroup
              name="consiglia"
              value={recommend}
              onChange={setRecommend}
              options={[
                { value: 'si', label: 'Sì, decisamente' },
                { value: 'forse', label: 'Forse' },
                { value: 'no', label: 'No' },
              ]}
            />
          </Question>

          <Question number={10} text="Quali aspetti ti hanno colpito positivamente? (seleziona tutti)">
            <div className="flex flex-col gap-2.5">
              {POSITIVE_ASPECTS.map(a => (
                <label key={a} className="flex items-center p-2.5 bg-white/[0.02] rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aspects.includes(a)}
                    onChange={() => toggleAspect(a)}
                    className="mr-3 w-[18px] h-[18px] cursor-pointer"
                  />
                  <span className="text-gray-400">{a}</span>
                </label>
              ))}
            </div>
          </Question>

          <Question number={11} text="Cosa potremmo migliorare? (facoltativo)">
            <textarea
              value={improvements}
              onChange={e => setImprovements(e.target.value)}
              placeholder="Condividi i tuoi suggerimenti..."
              className="w-full p-3 bg-white/5 border border-[#d4af37]/30 rounded text-[#eee] min-h-20 focus:outline-none focus:border-[#d4af37]"
            />
          </Question>

          <Question number={12} text="Sei interessato a ricevere aggiornamenti su futuri spettacoli?">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="La tua email (facoltativo)"
              className="w-full p-2.5 bg-white/5 border border-[#d4af37]/30 rounded text-[#eee] focus:outline-none focus:border-[#d4af37]"
            />
          </Question>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#d4af37] text-[#1a1a2e] rounded font-bold hover:bg-[#e6c851] hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            {submitting ? 'Invio…' : '✓ Invia Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}
