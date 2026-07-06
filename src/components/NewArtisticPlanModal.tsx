'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

const TABS = ['Produzione', 'Cast', 'Performance']

const RUOLI_OPTIONS = [
  'Romeo - Marco Rossi',
  'Giulietta - Sofia Bianchi',
  'Tebaldo - Giovanni Russo',
  'Lady Capuleti - Isabella Marchetti',
]

const KPI_OPTIONS = [
  'Rating Pubblico',
  'Occupazione Media',
  'Revenue Effettivo',
  'Feedback Critica',
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

export default function NewArtisticPlanModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tab, setTab] = useState(0)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [stagione, setStagione] = useState('')
  const [genere, setGenere] = useState('')
  const [direzione, setDirezione] = useState('')
  const [budget, setBudget] = useState('')
  const [noteArtistiche, setNoteArtistiche] = useState('')

  const [ruoli, setRuoli] = useState<string[]>([])
  const [compagnia, setCompagnia] = useState('')
  const [noteCast, setNoteCast] = useState('')

  const [spettatoriPrevisti, setSpettatoriPrevisti] = useState('')
  const [occupazioneTarget, setOccupazioneTarget] = useState('')
  const [revenuePrevisto, setRevenuePrevisto] = useState('')
  const [marginTarget, setMarginTarget] = useState('')
  const [kpi, setKpi] = useState<string[]>([])
  const [notePerformance, setNotePerformance] = useState('')

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  async function handleSave() {
    if (!title.trim()) {
      alert('Inserisci almeno il Titolo Produzione nel tab Produzione.')
      setTab(0)
      return
    }
    setSaving(true)

    const description = [
      stagione && `Stagione: ${stagione}`,
      genere && `Genere: ${genere}`,
      direzione && `Direzione artistica: ${direzione}`,
      budget && `Budget produzione: €${budget}`,
      noteArtistiche && `Note artistiche: ${noteArtistiche}`,
      ruoli.length > 0 && `Ruoli assegnati: ${ruoli.join(', ')}`,
      compagnia && `Compagnia/Ensemble: ${compagnia}`,
      noteCast && `Note cast: ${noteCast}`,
      spettatoriPrevisti && `Spettatori previsti: ${spettatoriPrevisti}`,
      occupazioneTarget && `Occupazione target: ${occupazioneTarget}%`,
      revenuePrevisto && `Revenue previsto: €${revenuePrevisto}`,
      marginTarget && `Margin target: ${marginTarget}%`,
      kpi.length > 0 && `KPI monitorati: ${kpi.join(', ')}`,
      notePerformance && `Note performance: ${notePerformance}`,
    ].filter(Boolean).join('\n')

    await supabase.from('shows').insert({
      title: title.trim(),
      date: new Date().toISOString(),
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
          <h2 className="text-[#d4af37] text-lg font-bold">🎭 Nuova Pianificazione Artistica</h2>
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
                <input className={inputCls} placeholder="Es. Romeo & Giulietta" value={title} onChange={e => setTitle(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Stagione *">
                  <select className={inputCls} value={stagione} onChange={e => setStagione(e.target.value)}>
                    <option value="">-- Seleziona --</option>
                    <option>2024/2025</option>
                    <option>2025/2026</option>
                  </select>
                </Field>
                <Field label="Genere *">
                  <select className={inputCls} value={genere} onChange={e => setGenere(e.target.value)}>
                    <option value="">-- Seleziona --</option>
                    <option>Lirica</option>
                    <option>Balletto</option>
                    <option>Dramma</option>
                    <option>Musical</option>
                    <option>Contemporaneo</option>
                    <option>Saggi Teatrali</option>
                    <option>Rassegna</option>
                    <option>Concerto</option>
                    <option>Cinema</option>
                  </select>
                </Field>
              </div>
              <Field label="Direzione Artistica *">
                <select className={inputCls} value={direzione} onChange={e => setDirezione(e.target.value)}>
                  <option value="">-- Seleziona direttore --</option>
                  <option>Franco Zeffirelli</option>
                  <option>Luca Franconi</option>
                  <option>Elena Ressi</option>
                </select>
              </Field>
              <Field label="Budget Produzione (€) *">
                <input type="number" step="100" className={inputCls} placeholder="50000" value={budget} onChange={e => setBudget(e.target.value)} />
              </Field>
              <Field label="Note Artistiche">
                <textarea
                  className={`${inputCls} h-20`}
                  placeholder="Descrizione visione artistica…"
                  value={noteArtistiche}
                  onChange={e => setNoteArtistiche(e.target.value)}
                />
              </Field>
            </div>
          )}

          {tab === 1 && (
            <div>
              <Field label="Ruoli Principali Assegnati">
                <div className="border border-gray-300 rounded p-2 max-h-48 overflow-y-auto">
                  {RUOLI_OPTIONS.map(r => (
                    <label key={r} className="flex items-center gap-2.5 p-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-900 cursor-pointer">
                      <input type="checkbox" checked={ruoli.includes(r)} onChange={() => toggle(ruoli, setRuoli, r)} />
                      {r}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Compagnie/Ensemble">
                <input className={inputCls} placeholder="Es. Balletto Contemporaneo Milano" value={compagnia} onChange={e => setCompagnia(e.target.value)} />
              </Field>
              <Field label="Note Cast">
                <textarea
                  className={`${inputCls} h-20`}
                  placeholder="Disponibilità, sostituzioni, requisiti…"
                  value={noteCast}
                  onChange={e => setNoteCast(e.target.value)}
                />
              </Field>
            </div>
          )}

          {tab === 2 && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Spettatori Previsti">
                  <input type="number" className={inputCls} placeholder="450" value={spettatoriPrevisti} onChange={e => setSpettatoriPrevisti(e.target.value)} />
                </Field>
                <Field label="Occupazione Target (%)">
                  <input type="number" min="0" max="100" className={inputCls} placeholder="75" value={occupazioneTarget} onChange={e => setOccupazioneTarget(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Revenue Previsto (€)">
                  <input type="number" step="100" className={inputCls} placeholder="18000" value={revenuePrevisto} onChange={e => setRevenuePrevisto(e.target.value)} />
                </Field>
                <Field label="Margin Target (%)">
                  <input type="number" min="0" max="100" className={inputCls} placeholder="60" value={marginTarget} onChange={e => setMarginTarget(e.target.value)} />
                </Field>
              </div>
              <Field label="KPI Monitoraggio">
                <div className="border border-gray-300 rounded p-2">
                  {KPI_OPTIONS.map(k => (
                    <label key={k} className="flex items-center gap-2.5 p-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-900 cursor-pointer">
                      <input type="checkbox" checked={kpi.includes(k)} onChange={() => toggle(kpi, setKpi, k)} />
                      {k}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Note Performance">
                <textarea
                  className={`${inputCls} h-16`}
                  placeholder="Target artistici, decisioni future…"
                  value={notePerformance}
                  onChange={e => setNotePerformance(e.target.value)}
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
            {saving ? 'Salvataggio…' : 'Salva Pianificazione'}
          </button>
        </div>
      </div>
    </div>
  )
}
