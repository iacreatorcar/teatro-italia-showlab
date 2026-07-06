'use client'

import { useState } from 'react'
import ScreenContentManager from '@/src/components/ScreenContentManager'
import LedWallPanel from '@/src/components/LedWallPanel'
import ArtistsManager from '@/src/components/ArtistsManager'
import ShowsManager from '@/src/components/ShowsManager'
import NewShowModal from '@/src/components/NewShowModal'
import NewArtisticPlanModal from '@/src/components/NewArtisticPlanModal'
import ProductionsPanel from '@/src/components/ProductionsPanel'
import BudgetPanel from '@/src/components/BudgetPanel'

type SectionId =
  | 'dashboard'
  | 'pianificazione-operativa'
  | 'pianificazione-artistica'
  | 'personale'
  | 'cast'
  | 'materiali'
  | 'signage'
  | 'ledwall'
  | 'artisti'
  | 'spettacoli'
  | 'archivi'
  | 'biglietteria'
  | 'amministrazione'

const SIDEBAR_GROUPS: { title: string; items: { id: SectionId; label: string }[] }[] = [
  {
    title: 'Panoramica',
    items: [
      { id: 'dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Pianificazione',
    items: [
      { id: 'pianificazione-operativa', label: 'Pianificazione Operativa' },
      { id: 'pianificazione-artistica', label: 'Pianificazione Artistica' },
    ],
  },
  {
    title: 'Risorse',
    items: [
      { id: 'personale', label: 'Gestione Personale' },
      { id: 'cast', label: 'Cast & Audizioni' },
      { id: 'materiali', label: 'Materiali & Costumi' },
    ],
  },
  {
    title: 'Operazioni',
    items: [
      { id: 'signage', label: 'Digital Signage' },
      { id: 'ledwall', label: 'LED Wall' },
      { id: 'artisti', label: 'Artisti' },
      { id: 'spettacoli', label: 'Spettacoli' },
      { id: 'archivi', label: 'Archivi' },
    ],
  },
  {
    title: 'Business',
    items: [
      { id: 'biglietteria', label: 'Biglietteria & Pubblico' },
      { id: 'amministrazione', label: 'Amministrazione & Budget' },
    ],
  },
]

const TITLES: Record<SectionId, string> = {
  dashboard: '🏠 Dashboard',
  'pianificazione-operativa': '📅 Pianificazione Operativa',
  'pianificazione-artistica': '🎨 Pianificazione Artistica',
  personale: '👥 Gestione Personale',
  cast: '🎭 Cast & Audizioni',
  materiali: '📦 Materiali & Costumi',
  signage: '📺 Digital Signage',
  ledwall: '🔴 LED Wall',
  artisti: '🎭 Artisti',
  spettacoli: '📅 Spettacoli',
  archivi: '📂 Archivi',
  biglietteria: '🎫 Biglietteria & Pubblico',
  amministrazione: '💼 Amministrazione & Budget',
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border-t-[3px] border-[#667eea]">
      <h3 className="text-[#1a1a2e] font-bold mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Stat({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold" style={{ color: valueColor ?? '#d4af37' }}>{value}</span>
    </div>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'success' | 'warning' | 'danger' }) {
  const cls = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  }[tone]
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${cls}`}>{children}</span>
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} className="bg-gray-50 text-left p-3 font-bold text-[#1a1a2e] border-b-2 border-[#d4af37]">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className="p-3 border-b border-gray-100 text-gray-900">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function groupOf(sectionId: SectionId) {
  return SIDEBAR_GROUPS.find(g => g.items.some(i => i.id === sectionId))?.title
}

export default function ArtisticDashboard() {
  const [active, setActive] = useState<SectionId>('dashboard')
  const [showNewShowModal, setShowNewShowModal] = useState(false)
  const [showNewPlanModal, setShowNewPlanModal] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | undefined>(groupOf('dashboard'))

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <div
        className="w-[280px] fixed h-screen overflow-y-auto p-5 pb-32"
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <div className="text-[#d4af37] text-base font-bold mb-7 pb-4 border-b border-[#d4af37]/30">
          🎭 SHOWTIME ERP
        </div>

        {SIDEBAR_GROUPS.map(group => {
          const isOpen = openGroup === group.title
          return (
            <div key={group.title} className="mb-3">
              <button
                onClick={() => setOpenGroup(isOpen ? undefined : group.title)}
                className="w-full flex items-center justify-between text-[#d4af37]/80 text-xs font-bold uppercase tracking-wide mb-2 py-1"
              >
                <span>{group.title}</span>
                <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {isOpen && (
                <div className="mb-3">
                  {group.items.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setActive(item.id)}
                      className={`px-3 py-2.5 rounded text-[13px] mb-1.5 cursor-pointer border-l-[3px] transition ${
                        active === item.id
                          ? 'bg-[#d4af37]/20 text-[#d4af37] font-bold border-[#d4af37]'
                          : 'text-gray-400 border-transparent hover:bg-[#d4af37]/10 hover:text-[#d4af37] hover:border-[#d4af37]'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <div className="absolute bottom-5 w-[calc(100%-40px)] p-4 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-md">
          <div className="text-[#d4af37] text-[11px] uppercase font-bold mb-1">Direttore Artistico</div>
          <div className="text-gray-200 text-[13px]">Nome Cognome</div>
          <div className="text-gray-400 text-[11px] mt-2">✓ Accesso reparto artistico</div>
        </div>
      </div>

      <div className="ml-[280px] flex-1 p-8">
        <div className="flex items-center justify-between mb-8 bg-white p-5 rounded-lg shadow-sm">
          <h1 className="text-[#1a1a2e] text-2xl font-bold">{TITLES[active]}</h1>
          <div className="flex gap-3">
            {active === 'pianificazione-operativa' && (
              <button
                onClick={() => setShowNewShowModal(true)}
                className="bg-[#d4af37] text-[#1a1a2e] font-bold px-5 py-2.5 rounded hover:bg-[#e6c851] transition"
              >
                + Nuovo Spettacolo
              </button>
            )}
            {active === 'pianificazione-artistica' && (
              <button
                onClick={() => setShowNewPlanModal(true)}
                className="bg-[#d4af37] text-[#1a1a2e] font-bold px-5 py-2.5 rounded hover:bg-[#e6c851] transition"
              >
                + Nuovo
              </button>
            )}
          </div>
        </div>

        {showNewShowModal && (
          <NewShowModal
            onClose={() => setShowNewShowModal(false)}
            onSaved={() => {}}
          />
        )}

        {showNewPlanModal && (
          <NewArtisticPlanModal
            onClose={() => setShowNewPlanModal(false)}
            onSaved={() => {}}
          />
        )}

        {active === 'dashboard' && <ProductionsPanel />}

        {active === 'pianificazione-operativa' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card title="📅 Spettacoli Programmati">
                <Stat label="Gennaio" value="8" />
                <Stat label="Febbraio" value="6" />
                <Stat label="Marzo" value="7" />
              </Card>
              <Card title="🎭 Sala Disponibilità">
                <Stat label="Sala Grande" value="12/20 gg" />
                <Stat label="Sala Camera" value="18/20 gg" />
                <Stat label="Studio" value="20/20 gg" />
              </Card>
              <Card title="⚠️ Conflitti da Risolvere">
                <Stat label="Doppia prenotazione" value="3" valueColor="#e74c3c" />
                <Stat label="Cast unavailable" value="2" valueColor="#e74c3c" />
              </Card>
            </div>
            <Card title="Prossimi Spettacoli">
              <Table
                headers={['Titolo', 'Data', 'Sala', 'Pubblico', 'Status']}
                rows={[
                  ['Il Trovatore', '15 Jan', 'Sala Grande', '450 posti', <Badge key="1" tone="success">In scena</Badge>],
                  ['Romeo & Giulietta', '22 Jan', 'Sala Grande', '450 posti', <Badge key="2" tone="warning">Prove</Badge>],
                  ['Pagliacci', '29 Jan', 'Sala Camera', '200 posti', <Badge key="3" tone="warning">Allestimento</Badge>],
                ]}
              />
            </Card>
          </div>
        )}

        {active === 'pianificazione-artistica' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card title="📊 Performance Produzioni">
                <Stat label="Spettatori totali" value="3.450" />
                <Stat label="Occupazione media" value="78%" />
                <Stat label="Rating gradimento" value="4.6/5" />
              </Card>
              <Card title="👥 Team Artistico">
                <Stat label="Cast attivi" value="47" />
                <Stat label="Team tecnico" value="23" />
                <Stat label="Disponibili" value="68" />
              </Card>
            </div>
            <Card title="Analisi Spettacoli (Data-Driven)">
              <Table
                headers={['Titolo', 'Spettatori', 'Revenue', 'Rating', 'ROI']}
                rows={[
                  ['Il Trovatore', '1.200', '€18.000', '4.8★', <Badge key="1" tone="success">+65%</Badge>],
                  ['La Traviata', '950', '€14.250', '4.4★', <Badge key="2" tone="success">+52%</Badge>],
                ]}
              />
            </Card>
          </div>
        )}

        {active === 'personale' && (
          <Card title="Team Disponibilità">
            <Table
              headers={['Nome', 'Ruolo', 'Disponibilità', 'Contratto', 'Azioni']}
              rows={[
                ['Marco Rossi', 'Attore Principale', <Badge key="1" tone="success">Disponibile</Badge>, '2025/06', <button key="b1" className="bg-[#667eea] text-white text-xs px-2.5 py-1 rounded">Modifica</button>],
                ['Sofia Bianchi', 'Soprano', <Badge key="2" tone="success">Disponibile</Badge>, '2025/04', <button key="b2" className="bg-[#667eea] text-white text-xs px-2.5 py-1 rounded">Modifica</button>],
                ['Luca Ferrari', 'Direttore Tecnico', <Badge key="3" tone="danger">In tournée</Badge>, '2025/12', <button key="b3" className="bg-[#667eea] text-white text-xs px-2.5 py-1 rounded">Modifica</button>],
              ]}
            />
          </Card>
        )}

        {active === 'cast' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card title="Audizioni Programmate">
              <Stat label="Gennaio" value="4" />
              <Stat label="Febbraio" value="3" />
            </Card>
          </div>
        )}

        {active === 'biglietteria' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card title="💰 Vendite Biglietti">
                <Stat label="Venduti (mese)" value="2.340 posti" />
                <Stat label="Revenue" value="€35.100" />
                <Stat label="Occupazione" value="76%" />
              </Card>
              <Card title="📊 Pubblico & Feedback">
                <Stat label="Spettatori mese" value="2.340" />
                <Stat label="Rating medio" value="4.6/5 ⭐" />
                <Stat label="Fidelity" value="42% repeat" />
              </Card>
            </div>
            <Card title="Spettacoli per Pubblico & Revenue">
              <Table
                headers={['Titolo', 'Pubblico', 'Occupazione', 'Revenue', 'Decisione Futura']}
                rows={[
                  ['Il Trovatore', '1.200', '84%', '€18.000', <Badge key="1" tone="success">✓ Ripetere</Badge>],
                  ['Pagliacci', '320', '32%', '€4.800', <Badge key="2" tone="danger">✗ Valutare</Badge>],
                ]}
              />
            </Card>
          </div>
        )}

        {active === 'amministrazione' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BudgetPanel />
            <Card title="📈 Revenue vs Spese">
              <Stat label="Incassi" value="€189.500" />
              <Stat label="Margine" value="+€30.500" valueColor="#26a65b" />
            </Card>
          </div>
        )}

        {active === 'signage' && <ScreenContentManager />}
        {active === 'ledwall' && <LedWallPanel />}
        {active === 'artisti' && <ArtistsManager />}
        {active === 'spettacoli' && <ShowsManager />}

        {(active === 'materiali' || active === 'archivi') && (
          <Card title={`${TITLES[active]} (in sviluppo)`}>
            <p className="text-gray-500 text-sm">
              {active === 'materiali' && 'Gestione inventario, tracciamento allestimenti — da costruire.'}
              {active === 'archivi' && 'Documentazione produzioni, contratti, media — da costruire.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
