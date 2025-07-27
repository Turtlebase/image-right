
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";

const HISTORY_KEY = 'image-rights-ai-history';

export interface ScanHistoryItem {
  id: string;
  date: string;
  result: ScanResultData;
}

export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const historyJson = localStorage.getItem(HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
}

export function addScanToHistory(result: ScanResultData): void {
  const history = getScanHistory();
  const newItem: ScanHistoryItem = {
    id: new Date().toISOString() + Math.random(),
    date: new Date().toISOString(),
    result: result,
  };
  const newHistory = [newItem, ...history].slice(0, 50); // Keep latest 50
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
}

export function getReportById(id: string): ScanHistoryItem | undefined {
  const history = getScanHistory();
  return history.find(item => item.id === id);
}
