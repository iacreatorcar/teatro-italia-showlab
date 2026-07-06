'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Artist, ArtistPhoto } from '@/src/lib/types'

export default function ArtistGalleryManager({ artists }: { artists: Artist[] }) {
  const [selectedArtistId, setSelectedArtistId] = useState<string>('')
  const [photos, setPhotos] = useState<ArtistPhoto[]>([])
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (selectedArtistId) loadPhotos(selectedArtistId)
    else setPhotos([])
  }, [selectedArtistId])

  async function loadPhotos(artistId: string) {
    const { data } = await supabase
      .from('artist_photos')
      .select('*')
      .eq('artist_id', artistId)
      .order('sort_order', { ascending: true })
    if (data) setPhotos(data as ArtistPhoto[])
  }

  async function addPhoto() {
    if (!selectedArtistId || !url.trim()) return
    await supabase.from('artist_photos').insert({
      artist_id: selectedArtistId,
      url: url.trim(),
      sort_order: photos.length,
    })
    setUrl('')
    loadPhotos(selectedArtistId)
  }

  async function deletePhoto(id: string) {
    await supabase.from('artist_photos').delete().eq('id', id)
    loadPhotos(selectedArtistId)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <h3 className="text-pink-600 font-bold mb-4 text-xl">🖼️ Galleria Foto Artista</h3>

      <select
        value={selectedArtistId}
        onChange={e => setSelectedArtistId(e.target.value)}
        className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600 mb-4 focus:outline-none focus:border-pink-400"
      >
        <option value="">Seleziona artista…</option>
        {artists.map(artist => (
          <option key={artist.id} value={artist.id}>{artist.name}</option>
        ))}
      </select>

      {selectedArtistId && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="URL foto"
              className="flex-1 bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-pink-400"
            />
            <button
              onClick={addPhoto}
              className="bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition"
            >
              + Aggiungi
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img src={photo.url} alt="" className="w-full h-24 object-cover rounded" />
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {photos.length === 0 && <p className="text-gray-500 text-sm">Nessuna foto extra per questo artista.</p>}
        </>
      )}
    </div>
  )
}
