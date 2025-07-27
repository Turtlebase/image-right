
import { type AnalyzeImageCopyrightOutput } from "@/ai/flows/analyze-image-copyright";
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";

const HISTORY_KEY = 'image-rights-ai-history';

export interface ScanHistoryItem {
  id: string;
  date: string;
  // We no longer store the full ScanResultData, just the AI output.
  result: AnalyzeImageCopyrightOutput;
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

  // Create a new result object without the imageUrl to save space
  const { imageUrl, ...resultToSave } = result;

  const newItem: ScanHistoryItem = {
    id: new Date().toISOString() + Math.random(),
    date: new Date().toISOString(),
    result: resultToSave,
  };

  const newHistory = [newItem, ...history].slice(0, 50); // Keep latest 50
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    // If it fails again, we can try clearing old history or just notify the user.
    // For now, we'll just log the error.
  }
}

export function getReportById(id: string): ScanHistoryItem | undefined {
  const history = getScanHistory();
  return history.find(item => item.id === id);
}
