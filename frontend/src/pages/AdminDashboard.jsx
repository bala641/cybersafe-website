import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [downloads, setDownloads] = useState([])
  const [stats, setStats] = useState({
    totalDownloads: 0,
    windowsCount: 0,
    macosCount: 0,
    androidCount: 0,
    uniqueUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    fetchDownloadHistory()
  }, [filterPlatform, dateRange])

  const fetchDownloadHistory = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/downloads', {
        params: {
          platform: filterPlatform === 'all' ? null : filterPlatform,
          dateRange: dateRange
        },
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      })

      setDownloads(response.data.downloads)
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch downloads:', error)
      alert('Failed to load download history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-white mb-4">Admin Dashboard</h1>
      <p className="text-slate-400 mb-12">Welcome, {user.email}</p>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4 mb-12">
        {[
          { label: 'Total Downloads', value: stats.totalDownloads, color: 'cyan' },
          { label: 'Windows', value: stats.windowsCount, color: 'blue' },
          { label: 'macOS', value: stats.macosCount, color: 'slate' },
          { label: 'Android', value: stats.androidCount, color: 'green' },
          { label: 'Unique Users', value: stats.uniqueUsers, color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-800 border border-slate-700 rounded-lg p-4`}>
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Platform</label>
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded px-4 py-2"
          >
            <option value="all">All Platforms</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="android">Android</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded px-4 py-2"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Download History Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Platform</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Date & Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">User ID</th>
              </tr>
            </thead>
            <tbody>
              {downloads.length > 0 ? (
                downloads.map((download, i) => (
                  <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="px-6 py-3 text-sm text-slate-300">{download.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        download.platform === 'windows' ? 'bg-blue-900 text-blue-200' :
                        download.platform === 'macos' ? 'bg-slate-700 text-slate-200' :
                        'bg-green-900 text-green-200'
                      }`}>
                        {download.platform.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-300">
                      {new Date(download.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-400 font-mono text-xs">
                      {download.userId.substring(0, 16)}...
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    No downloads in this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => {
            const csv = generateCSV(downloads)
            downloadFile(csv, 'downloads.csv', 'text/csv')
          }}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition"
        >
          📊 Export to CSV
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition"
        >
          🖨️ Print Report
        </button>
      </div>
    </div>
  )
}

function generateCSV(downloads) {
  const headers = ['Email', 'Platform', 'Timestamp', 'User ID']
  const rows = downloads.map(d => [
    d.email,
    d.platform,
    new Date(d.timestamp).toISOString(),
    d.userId
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  return csv
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
