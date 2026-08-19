import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_CRIME_CASES } from './data/mockCases';
import { CrimeCase, EvidenceItem, ActiveTabType } from './types';
import { vaultStorage } from './utils/vaultStorage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { EvidenceVault } from './components/EvidenceVault/EvidenceVault';
import { MasterTimeline } from './components/Timeline/MasterTimeline';
import { EntityGraph } from './components/GraphVisualizer/EntityGraph';
import { AIPatternStudio } from './components/AIIntelligence/AIPatternStudio';
import { AICopilotDrawer } from './components/AIIntelligence/AICopilotDrawer';
import { AIAgentSimulatorStudio } from './components/AIAgent/AIAgentSimulatorStudio';
import { OSINTIntelligenceStudio } from './components/OSINT/OSINTIntelligenceStudio';
import { AnalyticsCommandCenter } from './components/Analytics/AnalyticsCommandCenter';
import { TaskforceHub } from './components/Taskforce/TaskforceHub';
import { CustomRulesEngine } from './components/Rules/CustomRulesEngine';
import { ProsecutionStudio } from './components/Prosecution/ProsecutionStudio';
import { DeepfakeAuditStudio } from './components/DeepfakeAudit/DeepfakeAuditStudio';
import { GlobalThreatFeed } from './components/ThreatFeed/GlobalThreatFeed';
import { AssetSeizureStudio } from './components/AssetSeizure/AssetSeizureStudio';
import { VictimSafetyCenter } from './components/VictimSafety/VictimSafetyCenter';
import { IncidentReenactmentStudio } from './components/Reenactment/IncidentReenactmentStudio';
import { GeoRadarStudio } from './components/GeoRadar/GeoRadarStudio';
import { TamperAuditStudio } from './components/EvidenceVault/TamperAuditStudio';
import { MultiCaseStudio } from './components/CaseManager/MultiCaseStudio';
import { CreateCaseModal } from './components/CaseManager/CreateCaseModal';
import { PoliceReportView } from './components/PoliceReport/PoliceReportView';
import { IngestModal } from './components/EvidenceVault/IngestModal';
import { ChainOfCustodyModal } from './components/EvidenceVault/ChainOfCustodyModal';

export function App() {
  const [cases, setCases] = useState<CrimeCase[]>(() => vaultStorage.loadCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => vaultStorage.loadCases()[0]?.id || MOCK_CRIME_CASES[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('vault');
  const [piiRedacted, setPiiRedacted] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState<boolean>(false);

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Sync to localStorage on cases update
  useEffect(() => {
    vaultStorage.saveCases(cases);
  }, [cases]);

  const handleAddEvidenceItems = (newItems: EvidenceItem[]) => {
    setCases(prevCases =>
      prevCases.map(c => {
        if (c.id === selectedCaseId) {
          const updatedItems = [...newItems, ...c.evidenceItems];

          // Auto update graph nodes if new entities exist
          const newNodes = [...c.graphNodes];
          newItems.forEach(item => {
            item.entities.cryptoWallets.forEach((w, i) => {
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

            item.entities.phones.forEach((p, i) => {
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

  const handleCreateNewCase = (newCase: CrimeCase) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
  };

  const handleDeleteExhibit = (exhibitId: string) => {
    setCases(prevCases =>
      prevCases.map(c => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            evidenceItems: c.evidenceItems.filter(item => item.id !== exhibitId),
          };
        }
        return c;
      })
    );
  };

  const handleExportVaultJSON = () => {
    vaultStorage.exportVaultJSON(cases);
  };

  const handleImportVaultJSON = (jsonString: string) => {
    const imported = vaultStorage.importVaultJSON(jsonString);
    if (imported) {
      setCases(imported);
      if (imported[0]?.id) {
        setSelectedCaseId(imported[0].id);
      }
      alert('Forensic Evidence Vault Backup imported successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 selection:bg-cyan-500 selection:text-black font-mono">
      {/* Top Header */}
      <Header
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={setSelectedCaseId}
        piiRedacted={piiRedacted}
        onTogglePii={() => setPiiRedacted(!piiRedacted)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onExportVaultJSON={handleExportVaultJSON}
        onImportVaultJSON={handleImportVaultJSON}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Case Telemetry Bar */}
      <StatsBar currentCase={currentCase} />

      {/* Tab Views with Framer Motion Animation */}
      <main className="pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + selectedCaseId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'vault' && (
              <EvidenceVault
                currentCase={currentCase}
                piiRedacted={piiRedacted}
                onOpenIngestModal={() => setIsUploadModalOpen(true)}
                onIngestFiles={handleAddEvidenceItems}
                onDeleteExhibit={handleDeleteExhibit}
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
              <AIPatternStudio currentCase={currentCase} allCases={cases} />
            )}

            {activeTab === 'agent' && (
              <AIAgentSimulatorStudio
                currentCase={currentCase}
                onIngestDiscoveredExhibit={item => handleAddEvidenceItems([item])}
              />
            )}

            {activeTab === 'osint' && (
              <OSINTIntelligenceStudio
                currentCase={currentCase}
                onIngestOSINTExhibit={item => handleAddEvidenceItems([item])}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsCommandCenter
                currentCase={currentCase}
                allCases={cases}
              />
            )}

            {activeTab === 'seizure' && (
              <AssetSeizureStudio currentCase={currentCase} />
            )}

            {activeTab === 'safety' && (
              <VictimSafetyCenter currentCase={currentCase} />
            )}

            {activeTab === 'reenactment' && (
              <IncidentReenactmentStudio currentCase={currentCase} />
            )}

            {activeTab === 'prosecution' && (
              <ProsecutionStudio currentCase={currentCase} />
            )}

            {activeTab === 'deepfake' && (
              <DeepfakeAuditStudio currentCase={currentCase} />
            )}

            {activeTab === 'threats' && (
              <GlobalThreatFeed
                currentCase={currentCase}
                onIngestThreatExhibit={item => handleAddEvidenceItems([item])}
              />
            )}

            {activeTab === 'taskforce' && (
              <TaskforceHub currentCase={currentCase} />
            )}

            {activeTab === 'rules' && (
              <CustomRulesEngine currentCase={currentCase} />
            )}

            {activeTab === 'radar' && (
              <GeoRadarStudio currentCase={currentCase} />
            )}

            {activeTab === 'tamper' && (
              <TamperAuditStudio currentCase={currentCase} />
            )}

            {activeTab === 'cases' && (
              <MultiCaseStudio
                cases={cases}
                selectedCaseId={selectedCaseId}
                onSelectCase={setSelectedCaseId}
                onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
              />
            )}

            {activeTab === 'report' && (
              <PoliceReportView
                currentCase={currentCase}
                piiRedacted={piiRedacted}
                onBackToVault={() => setActiveTab('vault')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentCase={currentCase}
        onNavigateTab={setActiveTab}
      />

      {/* Evidence Ingestion Modal */}
      <IngestModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        existingCount={currentCase.evidenceItems.length}
        caseId={currentCase.id}
        onAddEvidence={item => handleAddEvidenceItems([item])}
      />

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isCreateCaseModalOpen}
        onClose={() => setIsCreateCaseModalOpen(false)}
        onCreateCase={handleCreateNewCase}
      />

      {/* Chain of Custody Audit Modal */}
      <ChainOfCustodyModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        evidenceItems={currentCase.evidenceItems}
      />
    </div>
  );
}

export default App;
