
"use client";

import { type AnalyzeImageCopyrightOutput } from "@/ai/flows/analyze-image-copyright";
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";

const HISTORY_KEY = 'image-rights-ai-history';

// The ScanHistoryItem will not include the full imageUrl to avoid storage quota issues.
export interface ScanHistoryItem extends Omit<AnalyzeImageCopyrightOutput, 'imageUrl'> {
  id: string;
  date: string;
  // We add a smaller thumbnail or a reference, but not the full data URI.
  // For simplicity now, we will omit it entirely from storage.
  imageUrl?: string; // This will be undefined when retrieved from history.
  riskLevel: 'safe' | 'attribution' | 'copyrighted';
  copyrightStatus: string;
}


export function getScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse scan history:", error);
    return [];
  }
}

export function addScanToHistory(resultData: ScanResultData): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const history = getScanHistory();
    
    // Create a new item for history, EXCLUDING the large imageUrl data URI
    const { imageUrl, ...restOfResult } = resultData;

    const newItem: ScanHistoryItem = {
      ...restOfResult,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };
    
    // Add the new item and keep the history to a reasonable size (e.g., 50 items)
    const newHistory = [newItem, ...history].slice(0, 50);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

  } catch (error) {
    console.error("Failed to save scan to history:", error);
    // This indicates a problem, which could still be a quota issue if other apps are storing a lot of data.
  }
}


export function getReportById(id: string): ScanHistoryItem | undefined {
  const history = getScanHistory();
  return history.find(report => report.id === id);
}
