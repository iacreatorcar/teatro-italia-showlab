'use client'

import { useState } from 'react'

export default function LedWallPanel() {
  const [text, setText] = useState('TEATRO ITALIA SHOW LAB')
  const [speed, setSpeed] = useState(10)

  return (
    <div>
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Gestione LED Wall</h2>

      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="bg-black h-32 rounded-lg border-2 border-pink-600 flex items-center justify-center overflow-hidden mb-6 relative">
          <div
            className="text-3xl font-bold text-pink-600 whitespace-nowrap"
            style={{
              animation: `scroll-left ${(25 - speed) * 0.8}s linear infinite`,
            }}
          >
            {text}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-pink-600 font-bold mb-2">Testo LED</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={100}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600"
            />
          </div>

          <div>
            <label className="block text-pink-600 font-bold mb-2">Velocità (1-20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-pink-600"
            />
          </div>

          <button className="w-full bg-pink-600 text-white px-4 py-2 rounded font-bold hover:bg-pink-700 transition">
            Aggiorna LED
          </button>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-pink-600 font-bold mb-4">Script Broadcast</h3>
        <textarea
          readOnly
          className="w-full bg-slate-700 text-gray-300 px-4 py-2 rounded border border-pink-600 font-mono text-sm h-40"
          value={`// WebSocket LED Wall Script
const ledwall = {
  text: "${text}",
  speed: ${speed},
  color: "#ff006e",
  brightness: 100,
  refresh_rate: 60
};

ws.send(JSON.stringify(ledwall));`}
        />
      </div>

      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}