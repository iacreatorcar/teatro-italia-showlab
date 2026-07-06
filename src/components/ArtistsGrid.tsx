'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Artist, ArtistPhoto } from '@/src/lib/types'

function ArtistDetailModal({ artist, onClose }: { artist: Artist; onClose: () => void }) {
  const [extraPhotos, setExtraPhotos] = useState<ArtistPhoto[]>([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    loadPhotos()
  }, [artist.id])

  async function loadPhotos() {
    const { data } = await supabase
      .from('artist_photos')
      .select('*')
      .eq('artist_id', artist.id)
      .order('sort_order', { ascending: true })
    if (data) setExtraPhotos(data as ArtistPhoto[])
  }

  const allPhotos = [
    ...(artist.photo_url ? [artist.photo_url] : []),
    ...extraPhotos.map(p => p.url),
  ]

  function prev() {
    setSlide(s => (s - 1 + allPhotos.length) % allPhotos.length)
  }
  function next() {
    setSlide(s => (s + 1) % allPhotos.length)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-[#16213e] rounded-lg p-6 max-w-md w-full border-2 border-[#d4af37] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="float-right text-2xl text-[#d4af37] hover:text-[#e6c851]">✕</button>

        {allPhotos.length > 0 ? (
          <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-square">
            <img
              src={allPhotos[slide]}
              alt={artist.name}
              className={`w-full h-full ${artist.photo_fit === 'cover' && slide === 0 ? 'object-cover' : 'object-contain'}`}
            />
            {allPhotos.length > 1 && (
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
                  {allPhotos.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === slide ? 'bg-[#d4af37]' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-6xl text-center mb-4">🎭</div>
        )}

        <h2 className="text-2xl font-bold text-[#d4af37] mb-2 text-center">{artist.name}</h2>
        <p className="text-[#667eea] text-xs font-bold uppercase text-center mb-4">{artist.role}</p>
        <p className="text-gray-300">{artist.bio}</p>
      </div>
    </div>
  )
}

export default function ArtistsGrid() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('Tutti')

  useEffect(() => {
    fetchArtists()
  }, [])

  async function fetchArtists() {
    const { data, error } = await supabase
      .from('artists')
      .select('*')

    if (!error && data) {
      setArtists(data as Artist[])
    }
    setLoading(false)
  }

  const categories = useMemo(() => {
    const roles = Array.from(new Set(artists.map(a => a.role).filter(Boolean)))
    return ['Tutti', ...roles]
  }, [artists])

  const filtered = filter === 'Tutti' ? artists : artists.filter(a => a.role === filter)

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div
      className="-mx-4 -my-8 px-4 py-10 rounded"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      <div className="text-center mb-10 pb-8 border-b-2 border-[#d4af37]">
        <h1 className="text-[#d4af37] text-4xl font-bold mb-2">🎭 SHOWTIME ERP</h1>
        <p className="text-gray-400">Compagnia e Artisti</p>
      </div>

      {categories.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`border-2 border-[#d4af37] rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === cat ? 'bg-[#d4af37] text-[#1a1a2e]' : 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1a2e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500">Nessun artista in questa categoria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(artist => (
          <div
            key={artist.id}
            onClick={() => setSelectedArtist(artist)}
            className="bg-white/5 border border-[#d4af37]/30 rounded-lg overflow-hidden cursor-pointer transition hover:-translate-y-2 hover:border-[#d4af37] hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
          >
            <div
              className="w-full h-80 flex items-center justify-center text-gray-400 text-sm overflow-hidden"
              style={{ background: artist.photo_url ? '#000' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {artist.photo_url ? (
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  className={`w-full h-full ${artist.photo_fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                />
              ) : (
                <span className="text-6xl">🎭</span>
              )}
            </div>
            <div className="p-5">
              <div className="text-[#d4af37] text-lg font-bold mb-1">{artist.name}</div>
              <div className="text-[#667eea] text-xs font-bold uppercase mb-2">{artist.role}</div>
              <p className="text-gray-400 text-sm line-clamp-3">{artist.bio}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedArtist && (
        <ArtistDetailModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
      )}
    </div>
  )
}
