'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show } from '@/src/lib/types'

function toDatetimeLocal(dateStr: string) {
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ShowsManager() {
  const [shows, setShows] = useState<Show[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(false)

  useEffect(() => { fetchShows() }, [])

  async function fetchShows() {
    const { data } = await supabase.from('shows').select('*').order('date', { ascending: true })
    if (data) setShows(data as Show[])
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      title: fd.get('title'),
      date: fd.get('date'),
      description: fd.get('description'),
    }
    if (editingId) {
      await supabase.from('shows').update(payload).eq('id', editingId)
      setEditingId(null)
    } else {
      await supabase.from('shows').insert(payload)
    }
    setMsg(true)
    setTimeout(() => setMsg(false), 2000)
    fetchShows()
    form.reset()
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    await supabase.from('shows').delete().eq('id', id)
    if (editingId === id) setEditingId(null)
    fetchShows()
  }

  const editingShow = shows.find(s => s.id === editingId)

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-lg shadow-sm border-t-[3px] border-[#667eea]">
        <h3 className="text-[#1a1a2e] font-bold mb-4">{editingId ? '✏️ Modifica Spettacolo' : '📅 Aggiungi Spettacolo'}</h3>
        {editingId && (
          <div className="mb-3 bg-yellow-100 text-yellow-800 px-4 py-2 rounded flex items-center justify-between text-sm">
            <span className="font-bold">Modalità modifica</span>
            <button onClick={() => setEditingId(null)} className="underline">Annulla</button>
          </div>
        )}
        {msg && <div className="mb-3 bg-green-100 text-green-800 p-2 rounded text-sm">✓ Salvato!</div>}
        <form key={editingId ?? 'new'} onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title" placeholder="Titolo" required defaultValue={editingShow?.title}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37]"
          />
          <input
            name="date" type="datetime-local" required
            defaultValue={editingShow ? toDatetimeLocal(editingShow.date) : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#d4af37]"
          />
          <textarea
            name="description" placeholder="Descrizione" defaultValue={editingShow?.description}
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
        <h3 className="text-[#1a1a2e] font-bold mb-4">Elenco Spettacoli</h3>
        <table className="w-full text-sm text-gray-900">
          <thead>
            <tr className="border-b-2 border-[#d4af37]">
              <th className="text-left p-2 text-gray-900">Titolo</th>
              <th className="text-left p-2 text-gray-900">Data</th>
              <th className="text-left p-2 text-gray-900">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show.id} className="border-b border-gray-100">
                <td className="p-2">{show.title}</td>
                <td className="p-2">{new Date(show.date).toLocaleString('it-IT')}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => setEditingId(show.id)} className="bg-[#667eea] text-white text-xs px-2.5 py-1 rounded">Modifica</button>
                  <button onClick={() => handleDelete(show.id)} className="bg-red-600 text-white text-xs px-2.5 py-1 rounded">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
