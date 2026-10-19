import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Downloads() {
  const { user, loginWithGoogle } = useAuth()
  const [selectedOS, setSelectedOS] = useState('windows')
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const platforms = {
    windows: {
      name: "Windows",
      icon: "🪟",
      size: "180 MB",
      file: "CyberSafe-Setup.exe",
      requirements: [
        "Windows 10/11",
        "Administrator privileges",
        "Npcap or WinPcap installed",
        "2GB RAM minimum"
      ],
      description: "Professional desktop application for Windows with real-time monitoring"
    },
    macos: {
      name: "macOS",
      icon: "🍎",
      size: "165 MB",
      file: "CyberSafe-Setup.dmg",
      requirements: [
        "macOS 10.14 or later",
        "Intel or Apple Silicon",
        "LibPcap installed",
        "2GB RAM minimum"
      ],
      description: "Native macOS application with full feature support"
    },
    android: {
      name: "Android",
      icon: "📱",
      size: "85 MB",
      file: "CyberSafe.apk",
      requirements: [
        "Android 8.0 or later",
        "VPN permission required",
        "Network monitoring permission",
        "2GB RAM minimum"
      ],
      description: "Mobile app for network monitoring on the go"
    }
  }

  const handleDownload = async () => {
    if (!user) {
      await loginWithGoogle()
      return
    }

    setDownloading(true)
    setDownloadProgress(0)

    try {
      const response = await axios.post('/api/download', {
        platform: selectedOS,
        userEmail: user.email,
        userId: user.uid
      }, {
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          setDownloadProgress(progress)
        }
      })

      // Trigger download
      const link = document.createElement('a')
      link.href = response.data.downloadUrl
      link.download = platforms[selectedOS].file
      link.click()
    } catch (error) {
      alert('Download failed: ' + error.message)
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-white mb-4 text-center">Download CyberSafe</h1>
      <p className="text-xl text-slate-400 text-center mb-12">Choose your platform below</p>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {Object.entries(platforms).map(([key, platform]) => (
          <button
            key={key}
            onClick={() => setSelectedOS(key)}
            className={`p-6 rounded-lg border-2 transition text-left ${
              selectedOS === key
                ? 'border-cyan-500 bg-slate-800'
                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <div className="text-4xl mb-4">{platform.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{platform.size}</p>
            <p className="text-sm text-slate-300">{platform.description}</p>
          </button>
        ))}
      </div>

      {/* Download Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">System Requirements</h2>
            <ul className="space-y-3">
              {platforms[selectedOS].requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Install Instructions</h2>
            <ol className="space-y-3 text-slate-300">
              <li><span className="text-cyan-400 font-bold">1.</span> Download the installer</li>
              <li><span className="text-cyan-400 font-bold">2.</span> Run the installer file</li>
              <li><span className="text-cyan-400 font-bold">3.</span> Grant required permissions</li>
              <li><span className="text-cyan-400 font-bold">4.</span> Wait for dependencies to install</li>
              <li><span className="text-cyan-400 font-bold">5.</span> Launch CyberSafe</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg p-8">
        <div className="flex flex-col items-center gap-4">
          {user ? (
            <>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {downloading ? '⏳ Downloading...' : '⬇️ Download Now'}
              </button>
              {downloading && (
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              )}
              {downloading && <p className="text-cyan-400">{downloadProgress}%</p>}
            </>
          ) : (
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Sign in with Google to Download
            </button>
          )}
          <p className="text-sm text-slate-400">
            Download links are tracked for analytics. Your email will be recorded.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Is CyberSafe free?",
              a: "Yes, CyberSafe is completely free and open source."
            },
            {
              q: "Do I need administrator privileges?",
              a: "Yes, admin privileges are required for packet capture capabilities."
            },
            {
              q: "What data is collected during download?",
              a: "Only your email, download timestamp, and platform selection are recorded for analytics."
            },
            {
              q: "Can I use CyberSafe offline?",
              a: "Yes, CyberSafe works completely offline after installation."
            }
          ].map((faq, i) => (
            <details key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-white hover:text-cyan-400">
                {faq.q}
              </summary>
              <p className="text-slate-400 mt-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
