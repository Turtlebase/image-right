
"use client";

import { type AnalyzeImageCopyrightOutput } from "@/ai/flows/analyze-image-copyright";
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";

const HISTORY_KEY = 'image-rights-ai-history';

// Note: We are reverting to a simplified interface that does not include all Firebase fields.
export interface ScanHistoryItem extends AnalyzeImageCopyrightOutput {
  id: string;
  date: string;
  imageUrl: string; 
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
  console.log("Saving to history is currently disabled to prevent storage issues.");
  // This function is disabled to prevent storage quota errors.
  // A backend solution like Firebase or another service is needed to properly store
  // image data without exceeding browser limits.
  
  // The code below is what causes the storage quota error.
  /*
  if (typeof window === 'undefined' || !resultData.imageUrl) {
    return;
  }
  const history = getScanHistory();
  const newItem: ScanHistoryItem = {
    ...resultData,
    id: new Date().toISOString(),
    date: new Date().toISOString(),
  };
  const newHistory = [newItem, ...history].slice(0, 50); // Keep latest 50
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save scan to history:", error);
    // This is where the quota exceeded error typically happens.
  }
  */
}


export function getReportById(id: string): ScanHistoryItem | undefined {
  const history = getScanHistory();
  return history.find(report => report.id === id);
}
