'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Show } from '@/src/lib/types'

export default function ScheduleList() {
  const [shows, setShows] = useState<Show[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShows()
  }, [])

  async function fetchShows() {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: true })

    if (!error && data) {
      setShows(data as Show[])
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Scaletta Spettacoli</h2>
      <div className="grid gap-4">
        {shows.map(show => (
          <div
            key={show.id}
            className="bg-slate-800 p-6 rounded-lg border-l-4 border-pink-600 hover:bg-slate-700 cursor-pointer transition"
          >
            <h3 className="text-xl font-bold text-pink-600 mb-2">{show.title}</h3>
            <p className="text-gray-300 mb-3">{show.description}</p>
            <span className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full text-sm">
              {new Date(show.date).toLocaleString('it-IT')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}