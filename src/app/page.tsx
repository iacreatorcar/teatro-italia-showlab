'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/src/components/Header'
import NavTabs from '@/src/components/NavTabs'

const ScheduleList = dynamic(() => import('@/src/components/ScheduleList'), { ssr: false })
const ArtistsGrid = dynamic(() => import('@/src/components/ArtistsGrid'), { ssr: false })
const AdminDashboard = dynamic(() => import('@/src/components/AdminDashboard'), { ssr: false })

export default function Home() {
  const [activeTab, setActiveTab] = useState('artists')

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'schedule' && <ScheduleList />}
        {activeTab === 'artists' && <ArtistsGrid />}
        {activeTab === 'admin' && <AdminDashboard />}
      </div>
    </div>
  )
}
