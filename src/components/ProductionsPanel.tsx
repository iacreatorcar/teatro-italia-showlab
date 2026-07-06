'use client'

import { useMemo, useState } from 'react'
import NewShowModal from '@/src/components/NewShowModal'
import ArtistQuickAddModal from '@/src/components/ArtistQuickAddModal'

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']

// dati finti — verranno collegati a Supabase in una fase successiva
const CAST = [
  { name: 'Marco Rossi', role: 'Attore Principale', status: 'Disponibile' as const },
  { name: 'Sofia Bianchi', role: 'Soprano', status: 'Disponibile' as const },
  { name: 'Luca Ferrari', role: 'Direttore Tecnico', status: 'In tournée' as const },
  { name: 'Elena Rossi', role: 'Coreografia', status: 'Disponibile' as const },
  { name: 'Andrea Moretti', role: 'Lighting Designer', status: 'Disponibile' as const },
]

const PRODUCTIONS = [
  { name: 'Il Trovatore', category: 'Stagione Lirica', status: 'In scena' },
  { name: 'Romeo & Giulietta', category: 'Balletto Contemporaneo', status: 'Prove' },
  { name: 'Pagliacci', category: 'Stagione Lirica', status: 'Pianificato' },
  { name: 'Sweeney Todd', category: 'Musical Europeo', status: 'Pianificato' },
]

const SHOW_DAYS = [5, 12, 18, 25]
const SHOW_NAMES = ['Il Trovatore', 'Romeo & Giulietta', 'Pagliacci']

function statusColor(status: string) {
  if (status === 'In scena' || status === 'Disponibile') return 'bg-[#26a65b]'
  if (status === 'In tournée') return 'bg-red-600'
  return 'bg-slate-500'
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/5 border-l-4 border-[#d4af37] rounded p-4 text-center">
      <div className="text-2xl font-bold text-[#d4af37]">{number}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function ListItem({ title, subtitle, status }: { title: string; subtitle: string; status: string }) {
  return (
    <div className="bg-white/[0.03] border-l-[3px] border-[#667eea] rounded p-3 mb-2 flex items-center justify-between">
      <div>
        <div className="text-[#d4af37] font-bold">{title}</div>
        <div className="text-gray-400 text-xs">{subtitle}</div>
      </div>
      <div className={`${statusColor(status)} text-white text-[11px] font-bold px-2 py-1 rounded`}>
        {status}
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-[#d4af37]/30 rounded-lg p-5">
      <h2 className="text-[#d4af37] text-lg font-bold mb-5">{title}</h2>
      {children}
    </div>
  )
}

export default function ProductionsPanel() {
  const [current, setCurrent] = useState(new Date(2025, 0, 1))
  const [showNewShow, setShowNewShow] = useState(false)
  const [showNewCast, setShowNewCast] = useState(false)

  const days = useMemo(() => {
    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startingDayOfWeek = firstDay.getDay()

    const cells: { day: number | null; show?: string }[] = []
    for (let i = 0; i < startingDayOfWeek; i++) cells.push({ day: null })
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, show: SHOW_DAYS.includes(d) ? SHOW_NAMES[d % SHOW_NAMES.length] : undefined })
    }
    return cells
  }, [current])

  function prevMonth() {
    setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return (
    <div
      className="rounded-lg p-6 text-[#eee]"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      <div className="bg-[#d4af37]/10 border-l-4 border-[#d4af37] rounded p-5 mb-6">
        <h1 className="text-[#d4af37] text-2xl font-bold">🎭 Produzioni & Cast</h1>
        <p className="text-gray-400 text-sm mt-1">
          Programmazione spettacoli, cast management e budget — dati dimostrativi, da collegare a Supabase
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <StatBox number={String(PRODUCTIONS.length)} label="Produzioni attive" />
        <StatBox number={String(CAST.length)} label="Cast assegnati" />
        <StatBox number="€245k" label="Budget stagione" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="📅 Calendario Spettacoli">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="bg-[#d4af37] text-[#1a1a2e] font-bold px-4 py-2 rounded hover:bg-[#e6c851] transition">
              ← Prev
            </button>
            <h3 className="text-[#d4af37] font-bold">{MONTH_NAMES[current.getMonth()]} {current.getFullYear()}</h3>
            <button onClick={nextMonth} className="bg-[#d4af37] text-[#1a1a2e] font-bold px-4 py-2 rounded hover:bg-[#e6c851] transition">
              Next →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[#d4af37] text-xs font-bold py-2">{d}</div>
            ))}
            {days.map((cell, i) => (
              <div
                key={i}
                onClick={() => cell.day !== null && setShowNewShow(true)}
                className={`bg-white/5 border border-[#d4af37]/20 rounded p-2 min-h-[60px] ${cell.day === null ? 'opacity-30' : 'hover:bg-[#d4af37]/15 hover:border-[#d4af37] transition cursor-pointer'}`}
              >
                {cell.day !== null && (
                  <>
                    <div className="text-xs text-gray-400 mb-1">{cell.day}</div>
                    {cell.show && (
                      <div
                        className="text-white text-[10px] px-1 py-0.5 rounded truncate"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      >
                        {cell.show}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center">Vista dimostrativa — collegamento a spettacoli reali in fase successiva</p>
        </Panel>

        <Panel title="👥 Cast & Disponibilità">
          <div className="max-h-80 overflow-y-auto">
            {CAST.map(c => (
              <ListItem key={c.name} title={c.name} subtitle={c.role} status={c.status} />
            ))}
          </div>
          <button
            onClick={() => setShowNewCast(true)}
            className="w-full bg-[#667eea] text-white rounded px-4 py-2 mt-2 font-bold hover:bg-[#7c8ff0] transition"
          >
            + Aggiungi Cast
          </button>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Panel title="🎬 Produzioni in corso">
          <div className="max-h-80 overflow-y-auto">
            {PRODUCTIONS.map(p => (
              <ListItem key={p.name} title={p.name} subtitle={p.category} status={p.status} />
            ))}
          </div>
          <button
            onClick={() => setShowNewShow(true)}
            className="w-full bg-[#667eea] text-white rounded px-4 py-2 mt-2 font-bold hover:bg-[#7c8ff0] transition"
          >
            + Nuova Produzione
          </button>
        </Panel>
      </div>

      {showNewShow && (
        <NewShowModal onClose={() => setShowNewShow(false)} onSaved={() => {}} />
      )}
      {showNewCast && (
        <ArtistQuickAddModal onClose={() => setShowNewCast(false)} onSaved={() => {}} />
      )}
    </div>
  )
}
