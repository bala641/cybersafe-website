import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function DownloadCenter() {
  const { user, loginWithGoogle } = useAuth()
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const platforms = {
    windows: {
      name: "Windows",
      icon: "🪟",
      size: "3 MB",
      file: "CyberSafe-Setup.exe",
      requirements: [
        "Windows 10/11",
        "3 MB free disk space",
        "Internet connection (for Python download)",
        "Administrator privileges (for installation)"
      ],
      description: "Complete installer with Python and all dependencies included. Everything installs automatically!",
      features: [
        "Automatic Python installation",
        "Automatic dependency installation",
        "One-click launch",
        "Professional GUI interface"
      ]
    },
    macos: {
      name: "macOS",
      icon: "🍎",
      size: "Coming Soon",
      file: "CyberSafe-Setup.dmg",
      requirements: [
        "macOS 10.14 or later",
        "Intel or Apple Silicon",
        "500 MB free disk space"
      ],
      description: "macOS installer (Coming Soon)",
      features: [
        "Native macOS experience",
        "Auto-installer",
        "Professional interface"
      ]
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
      description: "Mobile app for network monitoring on the go",
      features: [
        "Real-time monitoring",
        "Threat detection",
        "Port tracking",
        "Mobile interface"
      ]
    }
  }

  const [selectedOS, setSelectedOS] = useState('windows')

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
      <p className="text-xl text-slate-400 text-center mb-2">Professional Network Monitoring</p>
      <p className="text-md text-slate-500 text-center mb-12">Choose your platform and download the complete, ready-to-run installer</p>

      {/* Platform Selection */}
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
            <p className="text-sm text-cyan-400 font-semibold mb-4">{platform.size}</p>
            <p className="text-sm text-slate-300">{platform.description}</p>
          </button>
        ))}
      </div>

      {/* Details Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* System Requirements */}
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

          {/* Features */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
            <ul className="space-y-3">
              {platforms[selectedOS].features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="text-green-400">★</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Special for Windows */}
      {selectedOS === 'windows' && (
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg p-6 mb-8">
          <div className="flex gap-4">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="text-lg font-bold text-cyan-300 mb-2">Fully Automated Installation</h3>
              <p className="text-slate-300">
                Our Windows installer automatically detects your system, downloads and installs Python (if needed), 
                installs all dependencies, and launches CyberSafe. No manual steps required!
              </p>
            </div>
          </div>
        </div>
      )}

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
                <div className="w-full max-w-md">
                  <div className="bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-cyan-400 text-sm">{downloadProgress}%</p>
                </div>
              )}
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
            Your download will be tracked for analytics (email recorded)
          </p>
        </div>
      </div>

      {/* Installation Guide */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Installation Guide</h2>
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">🔧 For Windows</h3>
            <ol className="space-y-2 text-slate-300">
              <li><span className="text-cyan-400 font-bold">1.</span> Download CyberSafe-Setup.exe</li>
              <li><span className="text-cyan-400 font-bold">2.</span> Double-click the installer</li>
              <li><span className="text-cyan-400 font-bold">3.</span> The installer automatically:
                <ul className="ml-8 mt-2 space-y-1">
                  <li>• Checks for Python (downloads if needed)</li>
                  <li>• Installs all dependencies</li>
                  <li>• Launches CyberSafe</li>
                </ul>
              </li>
              <li><span className="text-cyan-400 font-bold">4.</span> Start monitoring your network!</li>
            </ol>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">⏱️ Installation Time</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>First time (new computer):</strong> 5-7 minutes</li>
              <li>• <strong>If Python exists:</strong> 30 seconds</li>
              <li>• <strong>Subsequent launches:</strong> Instant</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Do I need to install Python?",
              a: "No! Our Windows installer automatically handles Python installation. Just download and run!"
            },
            {
              q: "Will it interfere with my existing Python?",
              a: "No. The installer checks if Python exists and uses it. If not, it installs its own version."
            },
            {
              q: "What happens if the download fails?",
              a: "The installer will pause and ask you to check your internet. It will resume automatically."
            },
            {
              q: "Can I use it offline after installation?",
              a: "Yes! After installation, CyberSafe works completely offline."
            },
            {
              q: "Is it safe to download?",
              a: "Yes. Our installer is code-signed and verified. Your download is tracked for security."
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
