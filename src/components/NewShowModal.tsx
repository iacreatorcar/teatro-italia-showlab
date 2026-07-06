'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

const TABS = ['Base', 'Cast', 'Tecnico', 'Biglietteria']

const SALE = [
  { label: '-- Seleziona sala --', capacity: '' },
  { label: 'Sala Grande (450 posti)', capacity: '450' },
  { label: 'Sala Camera (200 posti)', capacity: '200' },
  { label: 'Studio (80 posti)', capacity: '80' },
]

const CAST_OPTIONS = [
  'Marco Rossi - Attore Principale',
  'Sofia Bianchi - Soprano',
  'Elena Rossi - Coreografa',
  'Giovanni Russo - Attore',
  'Isabella Marchetti - Soprano',
]

const RISORSE_OPTIONS = [
  'Crestron Control System',
  'Dante Audio Network',
  'LED Wall',
  'Projection Mapping',
  'Sistema Illuminotecnico',
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[#1a1a2e] font-bold text-sm mb-2">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30"

export default function NewShowModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tab, setTab] = useState(0)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [salaIdx, setSalaIdx] = useState(0)
  const [durata, setDurata] = useState('')
  const [tipoEvento, setTipoEvento] = useState('')

  const [cast, setCast] = useState<string[]>([])
  const [noteCast, setNoteCast] = useState('')

  const [direttoreTecnico, setDirettoreTecnico] = useState('')
  const [risorse, setRisorse] = useState<string[]>([])
  const [noteTecniche, setNoteTecniche] = useState('')

  const [prezzoStandard, setPrezzoStandard] = useState('')
  const [prezzoRidotto, setPrezzoRidotto] = useState('')
  const [dataApertura, setDataApertura] = useState('')
  const [categoria, setCategoria] = useState('')
  const [notePubblico, setNotePubblico] = useState('')

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  async function handleSave() {
    if (!title.trim() || !date || !time) {
      alert('Compila almeno titolo, data e ora nel tab Base.')
      setTab(0)
      return
    }
    setSaving(true)

    const description = [
      `Sala: ${SALE[salaIdx].label}`,
      durata && `Durata: ${durata} minuti`,
      tipoEvento && `Tipo evento: ${tipoEvento}`,
      cast.length > 0 && `Cast: ${cast.join(', ')}`,
      noteCast && `Note cast: ${noteCast}`,
      direttoreTecnico && `Direttore tecnico: ${direttoreTecnico}`,
      risorse.length > 0 && `Risorse: ${risorse.join(', ')}`,
      noteTecniche && `Note tecniche: ${noteTecniche}`,
      prezzoStandard && `Prezzo standard: €${prezzoStandard}`,
      prezzoRidotto && `Prezzo ridotto: €${prezzoRidotto}`,
      dataApertura && `Apertura vendite: ${dataApertura}`,
      categoria && `Categoria: ${categoria}`,
      notePubblico && `Note pubblico: ${notePubblico}`,
    ].filter(Boolean).join('\n')

    await supabase.from('shows').insert({
      title: title.trim(),
      date: `${date}T${time}`,
      description,
    })

    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between p-5 border-b-2 border-[#d4af37]"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
        >
          <h2 className="text-[#d4af37] text-lg font-bold">📅 Nuova Programmazione</h2>
          <button onClick={onClose} className="text-[#d4af37] text-2xl hover:text-[#e6c851]">×</button>
        </div>

        <div className="flex bg-gray-100 border-b border-gray-300">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 py-3.5 text-sm font-bold border-b-[3px] transition ${
                tab === i ? 'text-[#d4af37] border-[#d4af37] bg-[#d4af37]/5' : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-7">
          {tab === 0 && (
            <div>
              <Field label="Titolo Produzione *">
                <input className={inputCls} placeholder="Es. Il Trovatore" value={title} onChange={e => setTitle(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data Inizio *">
                  <input type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} />
                </Field>
                <Field label="Ora Inizio *">
                  <input type="time" className={inputCls} value={time} onChange={e => setTime(e.target.value)} />
                </Field>
              </div>
              <Field label="Sala *">
                <select className={inputCls} value={salaIdx} onChange={e => setSalaIdx(Number(e.target.value))}>
                  {SALE.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Capienza">
                  <input className={inputCls} value={SALE[salaIdx].capacity} disabled placeholder="450" />
                </Field>
                <Field label="Durata (minuti) *">
                  <input type="number" className={inputCls} placeholder="120" value={durata} onChange={e => setDurata(e.target.value)} />
                </Field>
              </div>
              <Field label="Tipo Evento *">
                <select className={inputCls} value={tipoEvento} onChange={e => setTipoEvento(e.target.value)}>
                  <option value="">-- Seleziona --</option>
                  <option>Rappresentazione</option>
                  <option>Prova</option>
                  <option>Tournée</option>
                  <option>Replica</option>
                </select>
              </Field>
            </div>
          )}

          {tab === 1 && (
            <div>
              <Field label="Assegnazione Cast">
                <div className="border border-gray-300 rounded p-2">
                  {CAST_OPTIONS.map(name => (
                    <label key={name} className="flex items-center gap-2.5 p-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-900 cursor-pointer">
                      <input type="checkbox" checked={cast.includes(name)} onChange={() => toggle(cast, setCast, name)} />
                      {name}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Note Cast">
                <textarea
                  className={`${inputCls} h-24`}
                  placeholder="Es. Marco Rossi non disponibile dal 20 gennaio…"
                  value={noteCast}
                  onChange={e => setNoteCast(e.target.value)}
                />
              </Field>
            </div>
          )}

          {tab === 2 && (
            <div>
              <Field label="Direttore Tecnico">
                <select className={inputCls} value={direttoreTecnico} onChange={e => setDirettoreTecnico(e.target.value)}>
                  <option value="">-- Seleziona --</option>
                  <option>Luca Ferrari (Crestron, Dante)</option>
                  <option>Roberto Santini (Sound)</option>
                  <option>Andrea Moretti (Lighting)</option>
                </select>
              </Field>
              <Field label="Risorse Richieste">
                <div className="border border-gray-300 rounded p-2">
                  {RISORSE_OPTIONS.map(r => (
                    <label key={r} className="flex items-center gap-2.5 p-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-900 cursor-pointer">
                      <input type="checkbox" checked={risorse.includes(r)} onChange={() => toggle(risorse, setRisorse, r)} />
                      {r}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Note Tecniche">
                <textarea
                  className={`${inputCls} h-20`}
                  placeholder="Es. Necessario pre-setup LED wall il giorno prima…"
                  value={noteTecniche}
                  onChange={e => setNoteTecniche(e.target.value)}
                />
              </Field>
            </div>
          )}

          {tab === 3 && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prezzo Biglietto Standard (€) *">
                  <input type="number" step="0.01" className={inputCls} placeholder="25.00" value={prezzoStandard} onChange={e => setPrezzoStandard(e.target.value)} />
                </Field>
                <Field label="Prezzo Ridotto (€)">
                  <input type="number" step="0.01" className={inputCls} placeholder="15.00" value={prezzoRidotto} onChange={e => setPrezzoRidotto(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Data Apertura Vendite">
                  <input type="date" className={inputCls} value={dataApertura} onChange={e => setDataApertura(e.target.value)} />
                </Field>
                <Field label="Posti Disponibili">
                  <input className={inputCls} disabled placeholder="450" value={SALE[salaIdx].capacity} />
                </Field>
              </div>
              <Field label="Categoria Evento *">
                <select className={inputCls} value={categoria} onChange={e => setCategoria(e.target.value)}>
                  <option value="">-- Seleziona --</option>
                  <option>Lirica</option>
                  <option>Balletto</option>
                  <option>Dramma</option>
                  <option>Musical</option>
                  <option>Contemporaneo</option>
                </select>
              </Field>
              <Field label="Note Pubblico">
                <textarea
                  className={`${inputCls} h-20`}
                  placeholder="Es. Evento con open bar, accesso libretto…"
                  value={notePubblico}
                  onChange={e => setNotePubblico(e.target.value)}
                />
              </Field>
            </div>
          )}
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
            {saving ? 'Salvataggio…' : 'Salva Programmazione'}
          </button>
        </div>
      </div>
    </div>
  )
}
