import React, { useState } from 'react';
import { MOCK_CRIME_CASES } from './data/mockCases';
import { CrimeCase, EvidenceItem } from './types';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { EvidenceVault } from './components/EvidenceVault/EvidenceVault';
import { MasterTimeline } from './components/Timeline/MasterTimeline';
import { EntityGraph } from './components/GraphVisualizer/EntityGraph';
import { AIPatternStudio } from './components/AIIntelligence/AIPatternStudio';
import { PoliceReportView } from './components/PoliceReport/PoliceReportView';
import { IngestModal } from './components/EvidenceVault/IngestModal';

export function App() {
  const [cases, setCases] = useState<CrimeCase[]>(MOCK_CRIME_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(MOCK_CRIME_CASES[0].id);
  const [activeTab, setActiveTab] = useState<'vault' | 'timeline' | 'graph' | 'ai' | 'report'>('vault');
  const [piiRedacted, setPiiRedacted] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleAddEvidence = (newItem: EvidenceItem) => {
    setCases(prevCases =>
      prevCases.map(c => {
        if (c.id === selectedCaseId) {
          const updatedItems = [newItem, ...c.evidenceItems];

          // Auto update nodes if new phone / crypto / bank accounts present
          const newNodes = [...c.graphNodes];
          newItem.entities.cryptoWallets.forEach((w, i) => {
            if (!newNodes.some(n => n.label.includes(w.slice(0, 8)))) {
              newNodes.push({
                id: `n-crypto-${Date.now()}-${i}`,
                label: `Wallet ${w.slice(0, 8)}...`,
                type: 'crypto',
                subtitle: w,
                riskLevel: 'critical',
              });
            }
          });

          newItem.entities.phones.forEach((p, i) => {
            if (!newNodes.some(n => n.label.includes(p))) {
              newNodes.push({
                id: `n-phone-${Date.now()}-${i}`,
                label: p,
                type: 'phone',
                subtitle: 'Suspect Phone Line',
                riskLevel: 'high',
              });
            }
          });

          return {
            ...c,
            evidenceItems: updatedItems,
            graphNodes: newNodes,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-cyan-900 selection:text-cyan-200">
      {/* Header */}
      <Header
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={setSelectedCaseId}
        piiRedacted={piiRedacted}
        onTogglePii={() => setPiiRedacted(!piiRedacted)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Case Telemetry Bar */}
      <StatsBar currentCase={currentCase} />

      {/* Tab Views */}
      <main className="pb-12">
        {activeTab === 'vault' && (
          <EvidenceVault
            currentCase={currentCase}
            piiRedacted={piiRedacted}
            onOpenIngestModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <MasterTimeline
            currentCase={currentCase}
            piiRedacted={piiRedacted}
          />
        )}

        {activeTab === 'graph' && (
          <EntityGraph currentCase={currentCase} />
        )}

        {activeTab === 'ai' && (
          <AIPatternStudio currentCase={currentCase} />
        )}

        {activeTab === 'report' && (
          <PoliceReportView
            currentCase={currentCase}
            piiRedacted={piiRedacted}
            onBackToVault={() => setActiveTab('vault')}
          />
        )}
      </main>

      {/* Evidence Ingestion Modal */}
      <IngestModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        existingCount={currentCase.evidenceItems.length}
        caseId={currentCase.id}
        onAddEvidence={handleAddEvidence}
      />
    </div>
  );
}

export default App;
