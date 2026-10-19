export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold text-white mb-12">Features</h1>

      <div className="space-y-12">
        {[
          {
            title: "Real-Time Packet Capture",
            description: "Capture and analyze network packets in real-time using Scapy",
            features: [
              "Live packet monitoring",
              "Protocol filtering (TCP, UDP, ICMP, HTTP, DNS)",
              "Packet statistics and analysis",
              "Export pcap files"
            ]
          },
          {
            title: "Advanced Threat Detection",
            description: "Identify common network attacks and suspicious patterns",
            features: [
              "Port scan detection",
              "SYN flood detection",
              "DDoS attack detection",
              "Data exfiltration alerts",
              "Anomalous pattern recognition"
            ]
          },
          {
            title: "Port & Service Monitoring",
            description: "Track all network connections and active services",
            features: [
              "Real-time port monitoring",
              "Service identification",
              "Connection state tracking",
              "Bandwidth usage monitoring",
              "Historical data logging"
            ]
          },
          {
            title: "Multi-Platform Support",
            description: "Works seamlessly across all your devices",
            features: [
              "Windows desktop application",
              "macOS application",
              "Android mobile app",
              "Cross-platform synchronization",
              "Unified dashboard"
            ]
          },
          {
            title: "Detailed Logging & Reports",
            description: "Comprehensive audit trails and reporting",
            features: [
              "Packet capture logs",
              "Threat detection logs",
              "System event logs",
              "Alert generation",
              "Export to CSV/PDF"
            ]
          },
          {
            title: "User-Friendly Interface",
            description: "Easy to use for both beginners and experts",
            features: [
              "Intuitive dashboard",
              "Real-time visualizations",
              "One-click installation",
              "No CLI required",
              "Help documentation"
            ]
          }
        ].map((section, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-2">{section.title}</h2>
            <p className="text-slate-400 mb-6">{section.description}</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {section.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-slate-300">
                  <span className="text-cyan-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">System Requirements</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">Windows</h3>
            <p className="text-sm text-slate-400">Windows 10/11<br/>2GB RAM minimum<br/>100MB disk space</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">macOS</h3>
            <p className="text-sm text-slate-400">macOS 10.14+<br/>2GB RAM minimum<br/>100MB disk space</p>
          </div>
          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">Android</h3>
            <p className="text-sm text-slate-400">Android 8.0+<br/>2GB RAM minimum<br/>50MB storage</p>
          </div>
        </div>
      </div>
    </div>
  )
}
