import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Network Traffic Monitoring,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"> Made Easy</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Monitor network packets, detect threats, and track ports in real-time. Like Wireshark, Zeek, and Suricata combined into one powerful tool.
            </p>
            <div className="flex gap-4">
              <Link
                to="/downloads"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                Download Now
              </Link>
              <Link
                to="/features"
                className="px-8 py-3 border border-slate-500 text-slate-300 font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg p-8 border border-slate-700">
              <div className="space-y-4">
                <div className="h-12 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-12 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-12 bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Packet Capture",
              description: "Real-time network packet capture with detailed protocol analysis"
            },
            {
              title: "Threat Detection",
              description: "Identify port scans, SYN floods, DDoS attacks, and data exfiltration"
            },
            {
              title: "Port Monitoring",
              description: "Track all active network connections and service ports"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gradient-to-b from-slate-800/50 to-transparent py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Network Security",
                description: "Monitor suspicious network activity and detect intrusions"
              },
              {
                title: "System Administration",
                description: "Track bandwidth usage and service health across your network"
              },
              {
                title: "Incident Response",
                description: "Quickly investigate network incidents with detailed packet logs"
              },
              {
                title: "Compliance Auditing",
                description: "Generate reports for security compliance requirements"
              }
            ].map((useCase, i) => (
              <div key={i} className="p-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">{useCase.title}</h3>
                <p className="text-slate-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Monitor Your Network?</h2>
          <p className="text-slate-300 mb-8 text-lg">Available for Windows, macOS, and Android</p>
          <Link
            to="/downloads"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
          >
            Download CyberSafe
          </Link>
        </div>
      </section>
    </div>
  )
}
