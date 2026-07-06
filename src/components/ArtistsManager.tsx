'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Artist } from '@/src/lib/types'

export default function ArtistsManager() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(false)

  useEffect(() => { fetchArtists() }, [])

  async function fetchArtists() {
    const { data } = await supabase.from('artists').select('*')
    if (data) setArtists(data as Artist[])
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: fd.get('name'),
      role: fd.get('role'),
      bio: fd.get('bio'),
      photo_url: fd.get('photo_url'),
      photo_fit: fd.get('photo_fit'),
    }
    if (editingId) {
      await supabase.from('artists').update(payload).eq('id', editingId)
      setEditingId(null)
    } else {
      await supabase.from('artists').insert(payload)
    }
    setMsg(true)
    setTimeout(() => setMsg(false), 2000)
    fetchArtists()
    form.reset()
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('artists').delete().eq('id', id)
    if (editingId === id) setEditingId(null)
    fetchArtists()
  }

  const editingArtist = artists.find(a => a.id === editingId)

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg shadow-sm border-t-[3px] border-[#667eea]">
        <h3 className="text-[#1a1a2e] font-bold mb-4">{editingId ? '✏️ Modifica Artista' : '👤 Aggiungi Artista'}</h3>
        {editingId && (
          <div className="mb-3 bg-yellow-100 text-yellow-800 px-4 py-2 rounded flex items-center justify-between text-sm">
            <span className="font-bold">Modalità modifica</span>
            <button onClick={() => setEditingId(null)} className="underline">Annulla</button>
          </div>
        )}
        {msg && <div className="mb-3 bg-green-100 text-green-800 p-2 rounded text-sm">✓ Salvato!</div>}
        <form key={editingId ?? 'new'} onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name" placeholder="Nome" required defaultValue={editingArtist?.name}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
          />
          <input
            name="role" placeholder="Ruolo" required defaultValue={editingArtist?.role}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
          />
          <input
            name="photo_url" placeholder="URL Foto" defaultValue={editingArtist?.photo_url}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
          />
          <div className="flex gap-4 text-sm text-gray-700">
            <label className="flex items-center gap-1">
              <input type="radio" name="photo_fit" value="contain" defaultChecked={(editingArtist?.photo_fit ?? 'contain') === 'contain'} /> Adatta
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="photo_fit" value="cover" defaultChecked={editingArtist?.photo_fit === 'cover'} /> Originale
            </label>
          </div>
          <textarea
            name="bio" placeholder="Bio" defaultValue={editingArtist?.bio}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 h-20 focus:outline-none focus:border-[#d4af37]"
          />
          <button
            type="submit" disabled={submitting}
            className="w-full bg-[#d4af37] text-[#1a1a2e] font-bold py-2 rounded hover:bg-[#e6c851] transition disabled:opacity-50"
          >
            {submitting ? 'Salvataggio…' : editingId ? 'Aggiorna' : 'Aggiungi'}
          </button>
        </form>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-[#1a1a2e] font-bold mb-4">Elenco Artisti</h3>
        <table className="w-full text-sm text-gray-900">
          <thead>
            <tr className="border-b-2 border-[#d4af37]">
              <th className="text-left p-2 text-gray-900">Nome</th>
              <th className="text-left p-2 text-gray-900">Ruolo</th>
              <th className="text-left p-2 text-gray-900">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist.id} className="border-b border-gray-100">
                <td className="p-2">{artist.name}</td>
                <td className="p-2">{artist.role}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => setEditingId(artist.id)} className="bg-[#667eea] text-white text-xs px-2.5 py-1 rounded">Modifica</button>
                  <button onClick={() => handleDelete(artist.id)} className="bg-red-600 text-white text-xs px-2.5 py-1 rounded">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
