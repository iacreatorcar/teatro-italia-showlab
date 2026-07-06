'use client'

import dynamic from 'next/dynamic'

const ArtisticDashboard = dynamic(() => import('@/src/components/ArtisticDashboard'), { ssr: false })

export default function AdminArtisticoPage() {
  return <ArtisticDashboard />
}
