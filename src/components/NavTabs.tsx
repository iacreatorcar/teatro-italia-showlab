interface NavTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function NavTabs({ activeTab, setActiveTab }: NavTabsProps) {
  const tabs = [
    { id: 'schedule', label: '📅 Scaletta' },
    { id: 'videos', label: '🎥 Video' },
    { id: 'artists', label: '👤 Artisti' },
    { id: 'ledwall', label: '📺 LED Wall' },
    { id: 'admin', label: '⚙️ Admin' }
  ]

  return (
    <div className="flex gap-2 p-6 flex-wrap bg-slate-800">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded transition ${
            activeTab === tab.id
              ? 'bg-pink-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-pink-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}