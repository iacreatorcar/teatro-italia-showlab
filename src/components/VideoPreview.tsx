'use client'

import { useState } from 'react'

export default function VideoPreview() {
  const [format, setFormat] = useState<'vertical' | 'horizontal'>('vertical')

  return (
    <div>
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Anteprima Video</h2>
      
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFormat('vertical')}
            className={`px-4 py-2 rounded transition ${
              format === 'vertical'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-700 hover:bg-pink-600'
            }`}
          >
            Verticale 9:16
          </button>
          <button
            onClick={() => setFormat('horizontal')}
            className={`px-4 py-2 rounded transition ${
              format === 'horizontal'
                ? 'bg-pink-600 text-white'
                : 'bg-slate-700 hover:bg-pink-600'
            }`}
          >
            Orizzontale 16:9
          </button>
        </div>

        <div
          className={`bg-black rounded-lg mb-6 flex items-center justify-center text-6xl ${
            format === 'vertical' ? 'w-96 aspect-[9/16]' : 'w-full aspect-video'
          }`}
        >
          📹
        </div>

        <div className="space-y-2">
          <p className="text-gray-300"><strong>Titolo:</strong> Video in anteprima</p>
          <p className="text-gray-300"><strong>Artista:</strong> Seleziona da scaletta</p>
        </div>
      </div>
    </div>
  )
}