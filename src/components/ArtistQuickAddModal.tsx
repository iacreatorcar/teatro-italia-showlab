'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

const inputCls = "w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[#1a1a2e] font-bold text-sm mb-2">{label}</label>
      {children}
    </div>
  )
}

export default function ArtistQuickAddModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFit, setPhotoFit] = useState<'contain' | 'cover'>('contain')
  const [bio, setBio] = useState('')

  async function handleSave() {
    if (!name.trim() || !role.trim()) {
      alert('Inserisci almeno Nome e Ruolo.')
      return
    }
    setSaving(true)
    await supabase.from('artists').insert({
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      photo_url: photoUrl.trim(),
      photo_fit: photoFit,
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-5 border-b-2 border-[#d4af37]"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
        >
          <h2 className="text-[#d4af37] text-lg font-bold">👥 Aggiungi Cast</h2>
          <button onClick={onClose} className="text-[#d4af37] text-2xl hover:text-[#e6c851]">×</button>
        </div>

        <div className="p-7">
          <Field label="Nome *">
            <input className={inputCls} placeholder="Es. Marco Rossi" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          <Field label="Ruolo *">
            <input className={inputCls} placeholder="Es. Attore Principale" value={role} onChange={e => setRole(e.target.value)} />
          </Field>
          <Field label="URL Foto">
            <input className={inputCls} placeholder="https://…" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
          </Field>
          <Field label="Foto">
            <div className="flex gap-4 text-sm text-gray-900">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={photoFit === 'contain'} onChange={() => setPhotoFit('contain')} /> Adatta
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={photoFit === 'cover'} onChange={() => setPhotoFit('cover')} /> Originale
              </label>
            </div>
          </Field>
          <Field label="Bio">
            <textarea className={`${inputCls} h-20`} placeholder="Breve biografia" value={bio} onChange={e => setBio(e.target.value)} />
          </Field>
        </div>

        <div className="p-5 bg-gray-100 border-t border-gray-300 flex justify-end gap-2.5">
          <button onClick={onClose} className="bg-gray-300 text-[#1a1a2e] font-bold px-5 py-2.5 rounded hover:bg-gray-400 transition">
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#d4af37] text-[#1a1a2e] font-bold px-5 py-2.5 rounded hover:bg-[#e6c851] transition disabled:opacity-50"
          >
            {saving ? 'Salvataggio…' : 'Salva Cast'}
          </button>
        </div>
      </div>
    </div>
  )
}
