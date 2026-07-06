'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Feedback, Show } from '@/src/lib/types'

function getSurveyUrl() {
  if (typeof window !== 'undefined') return `${window.location.origin}/survey`
  return '/survey'
}

function getQrUrl(url: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
}

export default function FeedbackViewer() {
  const [items, setItems] = useState<Feedback[]>([])
  const [shows, setShows] = useState<Record<string, string>>({})
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })
    if (data) setItems(data as Feedback[])
    const { data: showsData } = await supabase.from('shows').select('*')
    if (showsData) {
      const map: Record<string, string> = {}
      for (const s of showsData as Show[]) map[s.id] = s.title
      setShows(map)
    }
  }

  const avgShow = items.length ? (items.reduce((a, f) => a + f.rating_show, 0) / items.length).toFixed(1) : '—'
  const avgAccess = items.length ? (items.reduce((a, f) => a + f.rating_venue_access, 0) / items.length).toFixed(1) : '—'
  const recommendPct = items.length ? Math.round((items.filter(f => f.would_recommend).length / items.length) * 100) : 0

  const surveyUrl = getSurveyUrl()

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-pink-600 font-bold text-xl">📋 Survey Pubblico</h3>
        <button
          onClick={() => setShowQr(true)}
          className="bg-slate-700 text-white px-4 py-2 rounded text-sm hover:bg-slate-600 transition"
        >
          📱 QR Code Survey
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-700 rounded p-3 text-center">
          <div className="text-2xl font-bold text-pink-500">{avgShow}★</div>
          <div className="text-xs text-gray-400 mt-1">Media spettacolo</div>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <div className="text-2xl font-bold text-pink-500">{avgAccess}★</div>
          <div className="text-xs text-gray-400 mt-1">Media accesso teatro</div>
        </div>
        <div className="bg-slate-700 rounded p-3 text-center">
          <div className="text-2xl font-bold text-pink-500">{recommendPct}%</div>
          <div className="text-xs text-gray-400 mt-1">Consiglierebbero</div>
        </div>
      </div>

      {items.length === 0 && <p className="text-gray-500 text-sm">Nessuna risposta ancora.</p>}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map(f => (
          <div key={f.id} className="bg-slate-700 rounded p-3">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-300 font-bold">{f.show_id ? shows[f.show_id] ?? 'Spettacolo eliminato' : 'Non specificato'}</span>
              <span className="text-gray-500 text-xs">{new Date(f.created_at).toLocaleDateString('it-IT')}</span>
            </div>
            <div className="text-xs text-gray-400 mb-1">
              Spettacolo: {f.rating_show}★ · Accesso: {f.rating_venue_access}★ · {f.would_recommend ? '👍 Consiglia' : '👎 Non consiglia'}
            </div>
            {f.review && <p className="text-gray-300 text-sm">{f.review}</p>}
          </div>
        ))}
      </div>

      {showQr && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowQr(false)}>
          <div className="bg-slate-800 rounded-lg p-8 border-2 border-pink-600 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowQr(false)} className="float-right text-2xl text-pink-600 hover:text-pink-400">✕</button>
            <h3 className="text-xl font-bold text-pink-600 mb-4">QR Survey</h3>
            <img src={getQrUrl(surveyUrl)} alt="QR Survey" className="mx-auto rounded border-4 border-white" />
            <p className="text-xs text-gray-400 mt-3 break-all">{surveyUrl}</p>
          </div>
        </div>
      )}
    </div>
  )
}
