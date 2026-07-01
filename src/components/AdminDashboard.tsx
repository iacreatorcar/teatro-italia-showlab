'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show, Artist } from '@/src/lib/types'
import ScreenContentManager from '@/src/components/ScreenContentManager'

const ADMIN_PASSWORD = '1234'

type PrintContent = {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
}


function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-pink-600 font-bold mb-4 text-xl">{children}</h3>
}

function SuccessMsg({ show }: { show: boolean }) {
  if (!show) return null
  return <div className="mb-4 bg-green-600 text-white p-3 rounded">✓ Salvato!</div>
}

function InputField({ name, placeholder, required, type = 'text' }: {
  name: string; placeholder: string; required?: boolean; type?: string
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600 focus:outline-none focus:border-pink-400"
    />
  )
}

function TextAreaField({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600 h-20 focus:outline-none focus:border-pink-400"
    />
  )
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
    >
      Elimina
    </button>
  )
}

// ─── SEZIONE STAMPA ───────────────────────────────────────────────────────────

function PrintSection() {
  const [items, setItems] = useState<PrintContent[]>([])
  const [msg, setMsg] = useState(false)

  useEffect(() => { fetchPrint() }, [])

  async function fetchPrint() {
    const { data } = await supabase.from('print_content').select('*').order('created_at', { ascending: false })
    if (data) setItems(data as PrintContent[])
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('print_content').insert({
      title: fd.get('title'),
      description: fd.get('description'),
      image_url: fd.get('image_url'),
    })
    if (!error) {
      setMsg(true)
      setTimeout(() => setMsg(false), 2000)
      fetchPrint()
      e.currentTarget.reset()
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('print_content').delete().eq('id', id)
    fetchPrint()
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <SectionTitle>🖨️ Stampa</SectionTitle>
      <SuccessMsg show={msg} />
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <InputField name="title" placeholder="Titolo" required />
        <TextAreaField name="description" placeholder="Descrizione" />
        <InputField name="image_url" placeholder="URL Immagine" />
        <button type="submit" className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition">
          Aggiungi Contenuto Stampa
        </button>
      </form>

      {items.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-600">
              <th className="text-left p-2 text-pink-600">Titolo</th>
              <th className="text-left p-2 text-pink-600">Immagine</th>
              <th className="text-left p-2 text-pink-600">Azione</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-slate-700">
                <td className="p-2">{item.title}</td>
                <td className="p-2">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} className="h-10 w-16 object-cover rounded" />
                    : <span className="text-gray-500">—</span>
                  }
                </td>
                <td className="p-2"><DeleteBtn onClick={() => handleDelete(item.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─── SEZIONE ARTISTI LINK ─────────────────────────────────────────────────────

function ArtistLinkSection({ artists }: { artists: Artist[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrArtist, setQrArtist] = useState<Artist | null>(null)

  function getLink(artistId: string) {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/artist/${artistId}`
    }
    return `/artist/${artistId}`
  }

  async function copyLink(artist: Artist) {
    await navigator.clipboard.writeText(getLink(artist.id))
    setCopiedId(artist.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function getQrUrl(artistId: string) {
    const link = encodeURIComponent(getLink(artistId))
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}`
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <SectionTitle>🔗 Link Artisti</SectionTitle>
      <p className="text-gray-400 text-sm mb-4">Ogni artista può aggiornare la propria scheda tramite link personale.</p>

      {artists.length === 0 && <p className="text-gray-500 text-sm">Nessun artista. Aggiungine uno prima.</p>}

      <div className="space-y-3">
        {artists.map(artist => (
          <div key={artist.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-white">{artist.name}</p>
              <p className="text-sm text-gray-400">{artist.role}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => copyLink(artist)}
                className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 transition"
              >
                {copiedId === artist.id ? '✓ Copiato!' : '📋 Copia Link'}
              </button>
              <button
                onClick={() => setQrArtist(qrArtist?.id === artist.id ? null : artist)}
                className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-500 transition"
              >
                📱 QR Code
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Aggiorna la tua scheda: ' + getLink(artist.id))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
              >
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(getLink(artist.id))}&text=${encodeURIComponent('Aggiorna la tua scheda artista')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
              >
                Telegram
              </a>
            </div>
          </div>
        ))}
      </div>

      {qrArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-8 border-2 border-pink-600 text-center max-w-sm w-full">
            <button
              onClick={() => setQrArtist(null)}
              className="float-right text-2xl text-pink-600 hover:text-pink-400"
            >✕</button>
            <h3 className="text-xl font-bold text-pink-600 mb-2">{qrArtist.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{qrArtist.role}</p>
            <img
              src={getQrUrl(qrArtist.id)}
              alt="QR Code"
              className="mx-auto rounded border-4 border-white"
            />
            <p className="text-xs text-gray-400 mt-3 break-all">{getLink(qrArtist.id)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [shows, setShows] = useState<Show[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [showMsg, setShowMsg] = useState(false)

  async function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      fetchData()
    } else {
      alert('Password non corretta')
    }
  }

  async function fetchData() {
    const { data: showsData } = await supabase.from('shows').select('*')
    const { data: artistsData } = await supabase.from('artists').select('*')
    if (showsData) setShows(showsData as Show[])
    if (artistsData) setArtists(artistsData as Artist[])
  }

  async function addShow(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await supabase.from('shows').insert({
      title: fd.get('title'),
      date: fd.get('date'),
      description: fd.get('description'),
    })
    setShowMsg(true)
    setTimeout(() => setShowMsg(false), 2000)
    fetchData()
    e.currentTarget.reset()
  }

  async function addArtist(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await supabase.from('artists').insert({
      name: fd.get('name'),
      role: fd.get('role'),
      bio: fd.get('bio'),
    })
    setShowMsg(true)
    setTimeout(() => setShowMsg(false), 2000)
    fetchData()
    e.currentTarget.reset()
  }

  async function deleteShow(id: string) {
    await supabase.from('shows').delete().eq('id', id)
    fetchData()
  }

  async function deleteArtist(id: string) {
    await supabase.from('artists').delete().eq('id', id)
    fetchData()
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-slate-800 p-8 rounded-lg border-2 border-pink-600">
          <h2 className="text-2xl font-bold text-pink-600 mb-6">Accesso Admin</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600 mb-4 focus:outline-none focus:border-pink-400"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition"
          >
            Accedi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-pink-600">Admin Dashboard</h2>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition"
        >
          Esci
        </button>
      </div>

      <SuccessMsg show={showMsg} />

      {/* Spettacoli */}
      <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
        <SectionTitle>📅 Aggiungi Spettacolo</SectionTitle>
        <form onSubmit={addShow} className="space-y-3">
          <InputField name="title" placeholder="Titolo" required />
          <InputField name="date" placeholder="Data" type="datetime-local" required />
          <TextAreaField name="description" placeholder="Descrizione" />
          <button type="submit" className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition">
            Aggiungi
          </button>
        </form>
      </div>

      {/* Artisti */}
      <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
        <SectionTitle>👤 Aggiungi Artista</SectionTitle>
        <form onSubmit={addArtist} className="space-y-3">
          <InputField name="name" placeholder="Nome" required />
          <InputField name="role" placeholder="Ruolo" required />
          <TextAreaField name="bio" placeholder="Bio" />
          <button type="submit" className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition">
            Aggiungi
          </button>
        </form>
      </div>

      {/* Tabelle */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <SectionTitle>Spettacoli</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-600">
              <th className="text-left p-2 text-pink-600">Titolo</th>
              <th className="text-left p-2 text-pink-600">Data</th>
              <th className="text-left p-2 text-pink-600">Azione</th>
            </tr>
          </thead>
          <tbody>
            {shows.map(show => (
              <tr key={show.id} className="border-b border-slate-700">
                <td className="p-2">{show.title}</td>
                <td className="p-2">{new Date(show.date).toLocaleString('it-IT')}</td>
                <td className="p-2"><DeleteBtn onClick={() => deleteShow(show.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <SectionTitle>Artisti</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-600">
              <th className="text-left p-2 text-pink-600">Nome</th>
              <th className="text-left p-2 text-pink-600">Ruolo</th>
              <th className="text-left p-2 text-pink-600">Azione</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist.id} className="border-b border-slate-700">
                <td className="p-2">{artist.name}</td>
                <td className="p-2">{artist.role}</td>
                <td className="p-2"><DeleteBtn onClick={() => deleteArtist(artist.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nuove sezioni */}
      <PrintSection />
      <ArtistLinkSection artists={artists} />
      <ScreenContentManager />
    </div>
  )
}
