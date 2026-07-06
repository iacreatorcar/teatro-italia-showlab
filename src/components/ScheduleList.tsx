'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show, ShowPhoto } from '@/src/lib/types'

function ShowDetailModal({ show, onClose }: { show: Show; onClose: () => void }) {
  const [photos, setPhotos] = useState<ShowPhoto[]>([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    loadPhotos()
  }, [show.id])

  async function loadPhotos() {
    const { data } = await supabase
      .from('show_photos')
      .select('*')
      .eq('show_id', show.id)
      .order('sort_order', { ascending: true })
    if (data) setPhotos(data as ShowPhoto[])
  }

  function prev() {
    setSlide(s => (s - 1 + photos.length) % photos.length)
  }
  function next() {
    setSlide(s => (s + 1) % photos.length)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full border-2 border-pink-600 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="float-right text-2xl text-pink-600 hover:text-pink-400">✕</button>

        {photos.length > 0 && (
          <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-video">
            <img src={photos[slide].url} alt="" className="w-full h-full object-contain" />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full hover:bg-black/80"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-8 h-8 rounded-full hover:bg-black/80"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === slide ? 'bg-pink-500' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <h2 className="text-2xl font-bold text-pink-600 mb-2">{show.title}</h2>
        <span className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full text-sm mb-4">
          {new Date(show.date).toLocaleString('it-IT')}
        </span>
        <p className="text-gray-300 whitespace-pre-line">{show.description}</p>
      </div>
    </div>
  )
}

export default function ScheduleList() {
  const [shows, setShows] = useState<Show[]>([])
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)

  useEffect(() => {
    fetchShows()
  }, [])

  async function fetchShows() {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data) {
      setShows(data as Show[])
      fetchThumbnails(data.map(s => s.id))
    }
    setLoading(false)
  }

  async function fetchThumbnails(showIds: string[]) {
    if (showIds.length === 0) return
    const { data } = await supabase
      .from('show_photos')
      .select('*')
      .in('show_id', showIds)
      .order('sort_order', { ascending: true })

    if (data) {
      const map: Record<string, string> = {}
      for (const photo of data as ShowPhoto[]) {
        if (!map[photo.show_id]) map[photo.show_id] = photo.url
      }
      setThumbnails(map)
    }
  }

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Palinsesto Spettacoli</h2>
      <div className="grid gap-4">
        {shows.map(show => (
          <div
            key={show.id}
            onClick={() => setSelectedShow(show)}
            className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600 hover:bg-slate-700 cursor-pointer transition flex gap-4"
          >
            {thumbnails[show.id] && (
              <img
                src={thumbnails[show.id]}
                alt=""
                className="w-20 h-20 object-cover rounded shrink-0"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-pink-600 mb-2">{show.title}</h3>
              <p className="text-gray-300 mb-3">{show.description}</p>
              <span className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full text-sm">
                {new Date(show.date).toLocaleString('it-IT')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedShow && (
        <ShowDetailModal show={selectedShow} onClose={() => setSelectedShow(null)} />
      )}
    </div>
  )
}
