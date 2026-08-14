import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ShieldAlert,
  Radio,
  MapPin,
  Compass,
  Zap,
  AlertTriangle,
  Server,
  Lock,
  ExternalLink,
  Search,
} from 'lucide-react';
import { CrimeCase, IPTelemetryNode } from '../../types';

interface GeoRadarStudioProps {
  currentCase: CrimeCase;
}

const DEFAULT_MOCK_IP_NODES: IPTelemetryNode[] = [
  {
    ip: '185.220.101.42',
    country: 'Germany',
    city: 'Frankfurt',
    isp: 'Tor Exit Node Service GmbH',
    threatType: 'TOR_EXIT_NODE',
    latitude: 50.1109,
    longitude: 8.6821,
    associatedExhibits: ['EX-002', 'EX-001'],
    riskScore: 98,
  },
  {
    ip: '194.26.29.110',
    country: 'Romania',
    city: 'Bucharest',
    isp: 'Hostinger International VPN Proxy',
    threatType: 'VPN_PROXY',
    latitude: 44.4323,
    longitude: 26.1063,
    associatedExhibits: ['EX-001'],
    riskScore: 92,
  },
  {
    ip: '45.142.120.10',
    country: 'Netherlands',
    city: 'Amsterdam',
    isp: 'M247 Europe Data Center (Spoofed C2)',
    threatType: 'MALICIOUS_C2',
    latitude: 52.3676,
    longitude: 4.9041,
    associatedExhibits: ['EX-003'],
    riskScore: 96,
  },
  {
    ip: '74.125.200.100',
    country: 'United States',
    city: 'Mountain View, CA',
    isp: 'Google LLC Security Edge Node',
    threatType: 'RESIDENTIAL_ISP',
    latitude: 37.422,
    longitude: -122.084,
    associatedExhibits: ['EX-002'],
    riskScore: 25,
  },
];

export const GeoRadarStudio: React.FC<GeoRadarStudioProps> = ({ currentCase }) => {
  const [selectedIP, setSelectedIP] = useState<IPTelemetryNode | null>(DEFAULT_MOCK_IP_NODES[0]);
  const [threatFilter, setThreatFilter] = useState<string>('all');
  const [isRadarScanning, setIsRadarScanning] = useState<boolean>(true);

  const ipNodes = DEFAULT_MOCK_IP_NODES.filter(node => {
    return threatFilter === 'all' || node.threatType === threatFilter;
  });

  const getThreatBadgeColor = (threat: IPTelemetryNode['threatType']) => {
    switch (threat) {
      case 'TOR_EXIT_NODE':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'VPN_PROXY':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MALICIOUS_C2':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-mono space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0F172A]/90 border border-blue-900/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Globe className="w-6 h-6 animate-spin" style={{ animationDuration: '15s' }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              GEOSPATIAL IP TELEMETRY & CYBER THREAT RADAR STUDIO
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded font-mono">
                SATELLITE TRACING ONLINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Trace originating IP server nodes, Tor exit proxies, spoofed VPN relays, and geographic coordinates
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Threat Type:</span>
          <select
            value={threatFilter}
            onChange={e => setThreatFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All IP Threats ({DEFAULT_MOCK_IP_NODES.length})</option>
            <option value="TOR_EXIT_NODE">Tor Exit Nodes</option>
            <option value="VPN_PROXY">VPN Proxies</option>
            <option value="MALICIOUS_C2">Malicious C2 Servers</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Radar Screen & IP Node Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Map Visualizer */}
        <div className="lg:col-span-2 bg-[#060911] border border-blue-900/50 rounded-xl p-6 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          {/* Radar Sweep Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[450px] h-[450px] rounded-full border border-blue-500/40 flex items-center justify-center">
              <div className="w-[300px] h-[300px] rounded-full border border-blue-500/30 flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-full border border-blue-500/20" />
              </div>
            </div>
          </div>

          {/* Animated Radar Radar Sweep Line */}
          {isRadarScanning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="w-[480px] h-[480px] rounded-full bg-[conic-gradient(from_0deg,#3b82f640_0deg,transparent_60deg)]" />
            </motion.div>
          )}

          {/* Top Telemetry Overlay */}
          <div className="relative z-20 flex justify-between items-center text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800 backdrop-blur-sm">
            <span className="flex items-center gap-2 text-cyan-300 font-bold">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>RADAR TRACING TARGET: {currentCase.caseNumber}</span>
            </span>
            <span className="text-slate-400 font-mono">
              Victim Jurisdiction: <strong className="text-slate-200">{currentCase.victimLocation}</strong>
            </span>
          </div>

          {/* Geolocation IP Map Pins */}
          <div className="relative z-20 my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ipNodes.map(node => {
              const isSelected = selectedIP?.ip === node.ip;
              return (
                <motion.div
                  key={node.ip}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedIP(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-5 h-5 text-red-400 animate-bounce" />
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono">{node.ip}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{node.city}, {node.country}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getThreatBadgeColor(node.threatType)}`}>
                      {node.threatType.replace(/_/g, ' ')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Coordinates Log */}
          <div className="relative z-20 bg-slate-950/90 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 flex items-center justify-between">
            <span>Detected Remote Server Nodes: <strong className="text-slate-200">{DEFAULT_MOCK_IP_NODES.length} Unique IPs</strong></span>
            <span className="text-cyan-400 font-bold">Location Correlation: 94.8% Match</span>
          </div>
        </div>

        {/* IP Inspector Drawer */}
        <div className="bg-[#0F172A] border border-blue-900/60 rounded-xl p-5 shadow-2xl flex flex-col justify-between space-y-4 font-mono">
          {selectedIP ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedIP.ip}</h3>
                  <span className="text-xs text-cyan-400 font-semibold">{selectedIP.city}, {selectedIP.country}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">IP Threat Telemetry</label>
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-slate-300">
                  <div><strong className="text-slate-400">ISP Provider:</strong> {selectedIP.isp}</div>
                  <div><strong className="text-slate-400">Geo Coordinates:</strong> {selectedIP.latitude}, {selectedIP.longitude}</div>
                  <div>
                    <strong className="text-slate-400">Threat Category:</strong>{' '}
                    <span className="font-bold text-red-400">{selectedIP.threatType.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400">Risk Assessment:</strong>{' '}
                    <span className="font-bold text-amber-400">{selectedIP.riskScore}/100 Critical Risk</span>
                  </div>
                </div>
              </div>

              {/* Linked Evidence Exhibits */}
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Linked Evidence Exhibits</label>
                <div className="flex flex-wrap gap-2">
                  {selectedIP.associatedExhibits.map((ex, i) => (
                    <span key={i} className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] px-2.5 py-1 rounded font-bold">
                      Exhibit {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-950/30 border border-blue-800/50 p-3 rounded-lg text-xs text-blue-200">
                <span className="font-bold block mb-1">INTERPOL & ISP SUBPOENA DIRECTIVE:</span>
                Issue 18 U.S.C. § 2703(f) request to ISP provider <strong className="text-white">{selectedIP.isp}</strong> to freeze connection logs.
              </div>
            </div>
          ) : (
            <div className="text-center my-auto text-slate-500 text-xs">Select an IP Node on the radar screen</div>
          )}

          <div className="text-[10px] text-slate-500 text-center">
            Satellite IP Geolocation Tracing Engine v3.0
          </div>
        </div>
      </div>
    </div>
  );
};
