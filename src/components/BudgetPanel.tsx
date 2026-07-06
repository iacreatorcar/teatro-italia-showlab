export default function BudgetPanel() {
  return (
    <div className="bg-[#16213e] border border-[#d4af37]/30 rounded-lg p-5">
      <h2 className="text-[#d4af37] text-lg font-bold mb-5">💰 Budget Stagione 2025</h2>
      <div className="flex justify-between border-b border-[#d4af37]/10 pb-3 mb-3">
        <span className="text-gray-400">Budget totale</span>
        <span className="text-[#d4af37] font-bold">€245.000</span>
      </div>
      <div className="flex justify-between border-b border-[#d4af37]/10 pb-3 mb-3">
        <span className="text-gray-400">Speso finora</span>
        <span className="text-[#d4af37] font-bold">€159.000</span>
      </div>
      <div className="flex justify-between border-b border-[#d4af37]/10 pb-3 mb-3">
        <span className="text-gray-400">Rimanente</span>
        <span className="text-[#d4af37] font-bold">€86.000</span>
      </div>
      <div className="bg-white/10 h-2 rounded-full overflow-hidden mt-4">
        <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(90deg, #26a65b 0%, #d4af37 100%)' }} />
      </div>
      <div className="text-xs text-gray-500 text-right mt-2">65% utilizzato</div>
    </div>
  )
}
