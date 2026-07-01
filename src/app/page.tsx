'use client'

import { useState } from 'react'
import Header from '@/src/components/Header'
import NavTabs from '@/src/components/NavTabs'
import ScheduleList from '@/src/components/ScheduleList'
import VideoPreview from '@/src/components/VideoPreview'
import ArtistsGrid from '@/src/components/ArtistsGrid'
import LedWallPanel from '@/src/components/LedWallPanel'
import AdminDashboard from '@/src/components/AdminDashboard'

export default function Home() {
  const [activeTab, setActiveTab] = useState('schedule')

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'schedule' && <ScheduleList />}
        {activeTab === 'videos' && <VideoPreview />}
        {activeTab === 'artists' && <ArtistsGrid />}
        {activeTab === 'ledwall' && <LedWallPanel />}
        {activeTab === 'admin' && <AdminDashboard />}
      </div>
    </div>
  )
}