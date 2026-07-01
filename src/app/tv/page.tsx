'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useSearchParams } from 'next/navigation'

type ScreenContent = {
  title: string
  description: string
  image_url: string
  format: '16:9' | '9:16'
  fit: 'cover' | 'contain'
}

export default function TVScreen() {
  const searchParams = useSearchParams()
  const screenId = parseInt(searchParams.get('screen') || '1')
  const [content, setContent] = useState<ScreenContent | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('screen_content')
        .select('*')
        .eq('screen_id', screenId)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) setContent(data as ScreenContent)
    }

    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [screenId])

  if (!content) return <div className="w-full h-screen bg-black" />

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <img
        src={content.image_url}
        alt={content.title}
        className={`w-full h-full ${content.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
      />
      {(content.title || content.description) && (
        <div
          className="absolute bottom-0 left-0 right-0 px-10 py-8"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0) 100%)' }}
        >
          {content.title && (
            <h2 className="text-white font-bold text-4xl leading-tight drop-shadow-lg">
              {content.title}
            </h2>
          )}
          {content.description && (
            <p className="text-gray-200 text-xl font-normal mt-2 leading-snug drop-shadow max-w-3xl">
              {content.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
