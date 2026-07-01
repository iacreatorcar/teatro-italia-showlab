'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Artist } from '@/src/lib/types'

export default function ArtistsGrid() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Schede Artisti</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map(artist => (
          <div
            key={artist.id}
            onClick={() => setSelectedArtist(artist)}
            className="bg-slate-800 rounded-lg overflow-hidden border-2 border-pink-600 border-opacity-30 hover:border-pink-600 cursor-pointer transition transform hover:-translate-y-1"
          >
            <div className="w-full aspect-square bg-gradient-to-br from-purple-900 to-slate-800 flex items-center justify-center text-6xl">
              🎭
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-pink-600">{artist.name}</h3>
              <p className="text-sm text-gray-300">{artist.role}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md border-2 border-pink-600">
            <button
              onClick={() => setSelectedArtist(null)}
              className="float-right text-2xl text-pink-600 hover:text-pink-400"
            >
              ✕
            </button>
            <div className="text-6xl text-center mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">{selectedArtist.name}</h2>
            <p className="text-gray-300 mb-4"><strong>Ruolo:</strong> {selectedArtist.role}</p>
            <p className="text-gray-300"><strong>Bio:</strong> {selectedArtist.bio}</p>
          </div>
        </div>
      )}
    </div>
  )
}