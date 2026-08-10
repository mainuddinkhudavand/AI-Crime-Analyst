import { CrimeCase, EvidenceItem } from '../types';
import { MOCK_CRIME_CASES } from '../data/mockCases';

const STORAGE_KEY = 'AI_CRIME_INVESTIGATOR_CASES_V1';

/**
 * Vault Storage Manager for Local Persistence & Forensic Backup
 */
export const vaultStorage = {
  loadCases(): CrimeCase[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load vault from localStorage, falling back to mock cases:', e);
    }
    return MOCK_CRIME_CASES;
  },

  saveCases(cases: CrimeCase[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Failed to save cases to localStorage:', e);
    }
  },

  exportVaultJSON(cases: CrimeCase[]): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EVIDENCE_VAULT_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importVaultJSON(jsonString: string): CrimeCase[] | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].evidenceItems) {
        this.saveCases(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Invalid vault JSON backup:', e);
    }
    return null;
  },

  resetToDefault(): CrimeCase[] {
    localStorage.removeItem(STORAGE_KEY);
    return MOCK_CRIME_CASES;
  },
};
