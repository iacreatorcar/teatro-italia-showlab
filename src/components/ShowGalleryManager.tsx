'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show, ShowPhoto } from '@/src/lib/types'

export default function ShowGalleryManager({ shows }: { shows: Show[] }) {
  const [selectedShowId, setSelectedShowId] = useState<string>('')
  const [photos, setPhotos] = useState<ShowPhoto[]>([])
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (selectedShowId) loadPhotos(selectedShowId)
    else setPhotos([])
  }, [selectedShowId])

  async function loadPhotos(showId: string) {
    const { data } = await supabase
      .from('show_photos')
      .select('*')
      .eq('show_id', showId)
      .order('sort_order', { ascending: true })
    if (data) setPhotos(data as ShowPhoto[])
  }

  async function addPhoto() {
    if (!selectedShowId || !url.trim()) return
    await supabase.from('show_photos').insert({
      show_id: selectedShowId,
      url: url.trim(),
      sort_order: photos.length,
    })
    setUrl('')
    loadPhotos(selectedShowId)
  }

  async function deletePhoto(id: string) {
    await supabase.from('show_photos').delete().eq('id', id)
    loadPhotos(selectedShowId)
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <h3 className="text-pink-600 font-bold mb-4 text-xl">🖼️ Galleria Foto Spettacolo</h3>

      <select
        value={selectedShowId}
        onChange={e => setSelectedShowId(e.target.value)}
        className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600 mb-4 focus:outline-none focus:border-pink-400"
      >
        <option value="">Seleziona spettacolo…</option>
        {shows.map(show => (
          <option key={show.id} value={show.id}>{show.title}</option>
        ))}
      </select>

      {selectedShowId && (
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
          {photos.length === 0 && <p className="text-gray-500 text-sm">Nessuna foto per questo spettacolo.</p>}
        </>
      )}
    </div>
  )
}
