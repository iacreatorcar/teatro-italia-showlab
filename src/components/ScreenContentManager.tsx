'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'

type ScreenContent = {
  id: string
  title: string
  description: string
  image_url: string
  format: '16:9' | '9:16'
  fit: 'cover' | 'contain'
  screen_id: number
  active: boolean
}

type FormState = {
  image_url: string
  title: string
  description: string
  format: '16:9' | '9:16'
  fit: 'cover' | 'contain'
  screen_id: string
}

const EMPTY_FORM: FormState = {
  image_url: '',
  title: '',
  description: '',
  format: '16:9',
  fit: 'cover',
  screen_id: '1',
}

function Preview({ form }: { form: FormState }) {
  const { image_url, title, description, format, fit } = form
  const is169 = format === '16:9'

  return (
    <div>
      <p className="text-pink-600 font-bold text-sm mb-2">Preview TV</p>
      <div
        className="relative bg-black rounded overflow-hidden border border-slate-600"
        style={is169 ? { aspectRatio: '16/9', width: '100%' } : { aspectRatio: '9/16', width: '160px' }}
      >
        {image_url ? (
          <img
            src={image_url}
            alt="preview"
            className={`absolute inset-0 w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
            onError={e => { e.currentTarget.style.opacity = '0' }}
            onLoad={e => { e.currentTarget.style.opacity = '1' }}
            style={{ opacity: 0, transition: 'opacity 0.3s' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm">
            Nessuna immagine
          </div>
        )}

        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 p-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)' }}
          >
            {title && (
              <p className="text-white font-bold text-lg leading-tight truncate drop-shadow-lg">
                {title}
              </p>
            )}
            {description && (
              <p className="text-gray-200 mt-1 leading-snug line-clamp-2 text-xs font-normal drop-shadow">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {!is169 && <p className="text-gray-500 text-xs mt-1">9:16 verticale</p>}
    </div>
  )
}

export default function ScreenContentManager() {
  const [items, setItems] = useState<ScreenContent[]>([])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [msg, setMsg] = useState<'success' | 'error' | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    const { data } = await supabase
      .from('screen_content')
      .select('*')
      .order('screen_id', { ascending: true })
    if (data) setItems(data as ScreenContent[])
  }

  function startEdit(item: ScreenContent) {
    setEditingId(item.id)
    setForm({
      image_url: item.image_url,
      title: item.title,
      description: item.description,
      format: item.format,
      fit: item.fit ?? 'cover',
      screen_id: String(item.screen_id),
    })
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.image_url.trim()) {
      e.image_url = 'URL obbligatorio'
    } else {
      try { new URL(form.image_url) } catch { e.image_url = 'URL non valido' }
    }
    if (!form.title.trim()) e.title = 'Titolo obbligatorio'
    if (form.description.length > 200) e.description = 'Max 200 caratteri'
    const n = parseInt(form.screen_id)
    if (isNaN(n) || n < 1 || n > 4) e.screen_id = 'Schermo 1–4'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    const screenId = parseInt(form.screen_id)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      format: form.format,
      fit: form.fit,
      screen_id: screenId,
    }

    let error = null

    if (editingId) {
      // modifica esistente
      const res = await supabase
        .from('screen_content')
        .update(payload)
        .eq('id', editingId)
      error = res.error
    } else {
      // nuovo: disattiva precedente stesso schermo
      await supabase
        .from('screen_content')
        .update({ active: false })
        .eq('screen_id', screenId)
        .eq('active', true)

      const res = await supabase.from('screen_content').insert({ ...payload, active: true })
      error = res.error
    }

    if (error) {
      setMsg('error')
    } else {
      setMsg('success')
      setForm(EMPTY_FORM)
      setEditingId(null)
      setErrors({})
      loadItems()
    }
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleDelete(id: string) {
    await supabase.from('screen_content').delete().eq('id', id)
    if (editingId === id) cancelEdit()
    loadItems()
  }

  async function toggleActive(item: ScreenContent) {
    await supabase.from('screen_content').update({ active: !item.active }).eq('id', item.id)
    loadItems()
  }

  function setField(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const descLen = form.description.length

  return (
    <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600">
      <h3 className="text-pink-600 font-bold mb-1 text-xl">📺 TV Foyer</h3>
      <p className="text-gray-400 text-sm mb-5">
        Incolla URL immagine + testo. Layout fisso. Schermo su{' '}
        <code className="text-pink-400 bg-slate-700 px-1 rounded">/tv?screen=1</code> (1–4).
      </p>

      {msg === 'success' && (
        <div className="mb-4 bg-green-600 text-white p-3 rounded font-bold">
          ✓ {editingId ? 'Aggiornato!' : 'Salvato!'}
        </div>
      )}
      {msg === 'error' && (
        <div className="mb-4 bg-red-600 text-white p-3 rounded font-bold">✗ Errore. Riprova.</div>
      )}

      {editingId && (
        <div className="mb-4 bg-yellow-600 text-white px-4 py-2 rounded flex items-center justify-between">
          <span className="text-sm font-bold">✏️ Modalità modifica</span>
          <button onClick={cancelEdit} className="text-sm underline hover:no-underline">
            Annulla
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <label className="block text-sm text-gray-300 mb-1">URL Immagine *</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setField('image_url', e.target.value)}
              placeholder="https://..."
              className={`w-full bg-slate-700 text-white px-4 py-2 rounded border focus:outline-none focus:border-pink-400 ${
                errors.image_url ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.image_url && <p className="text-red-400 text-xs mt-1">{errors.image_url}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Titolo *{' '}
              <span className={form.title.length > 50 ? 'text-yellow-400' : 'text-gray-500'}>
                {form.title.length}/60
              </span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="es. Concerto Jazz"
              maxLength={60}
              className={`w-full bg-slate-700 text-white px-4 py-2 rounded border focus:outline-none focus:border-pink-400 ${
                errors.title ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Descrizione{' '}
              <span className={
                descLen > 200 ? 'text-red-400' :
                descLen > 180 ? 'text-yellow-400' :
                'text-gray-500'
              }>
                {descLen}/200
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              maxLength={200}
              placeholder="Testo breve mostrato sullo schermo"
              rows={3}
              className={`w-full bg-slate-700 text-white px-4 py-2 rounded border focus:outline-none focus:border-pink-400 resize-none ${
                errors.description ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Formato</label>
              <select
                value={form.format}
                onChange={e => setField('format', e.target.value as '16:9' | '9:16')}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-pink-400"
              >
                <option value="16:9">16:9 — orizzontale</option>
                <option value="9:16">9:16 — verticale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Immagine</label>
              <div className="flex rounded overflow-hidden border border-slate-600 h-[38px]">
                <button
                  type="button"
                  onClick={() => setField('fit', 'cover')}
                  className={`flex-1 text-xs font-bold transition ${
                    form.fit === 'cover'
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  Riempi
                </button>
                <button
                  type="button"
                  onClick={() => setField('fit', 'contain')}
                  className={`flex-1 text-xs font-bold transition ${
                    form.fit === 'contain'
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  Adatta
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Schermo (1–4) *</label>
              <input
                type="number"
                value={form.screen_id}
                onChange={e => setField('screen_id', e.target.value)}
                min="1"
                max="4"
                className={`w-full bg-slate-700 text-white px-4 py-2 rounded border focus:outline-none focus:border-pink-400 ${
                  errors.screen_id ? 'border-red-500' : 'border-slate-600'
                }`}
              />
              {errors.screen_id && <p className="text-red-400 text-xs mt-1">{errors.screen_id}</p>}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white px-4 py-2 rounded font-bold transition mt-2 ${
              editingId
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {editingId ? `✏️ Aggiorna Schermo ${form.screen_id}` : `Salva su Schermo ${form.screen_id}`}
          </button>
        </form>

        <Preview form={form} />
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <p className="text-pink-600 font-bold text-sm mb-3">Contenuti salvati</p>
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded flex-wrap transition ${
                  editingId === item.id ? 'bg-yellow-900 border border-yellow-600' : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-10 w-16 object-cover rounded shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-gray-400 text-xs truncate max-w-xs">{item.description}</p>
                    )}
                    <p className="text-gray-500 text-xs">TV {item.screen_id} · {item.format}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-2 py-1 rounded text-xs font-bold transition ${
                      item.active
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  >
                    {item.active ? '🟢 Attivo' : '⚫ Inattivo'}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition"
                  >
                    ✏️ Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
