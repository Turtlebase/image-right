
"use client";

import { type AnalyzeImageCopyrightOutput } from "@/ai/flows/analyze-image-copyright";
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";
import { type SubscriptionPlan } from '@/hooks/useSubscription';

const HISTORY_KEY = 'image-rights-ai-history';
const THUMBNAIL_MAX_WIDTH = 128;
const THUMBNAIL_MAX_HEIGHT = 128;
const FREE_HISTORY_LIMIT = 5;

// The ScanHistoryItem will now include a smaller imageUrl (thumbnail) to avoid storage quota issues.
export interface ScanHistoryItem extends Omit<AnalyzeImageCopyrightOutput, 'imageUrl'> {
  id: string;
  date: string;
  imageUrl: string; // This will be a compressed base64 thumbnail.
  riskLevel: 'safe' | 'attribution' | 'copyrighted';
  copyrightStatus: string;
}

/**
 * Creates a compressed thumbnail from a full-size image data URI.
 * @param dataUrl The original image data URI.
 * @returns A promise that resolves with the thumbnail data URI.
 */
function createThumbnail(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            let { width, height } = img;

            // Calculate new dimensions while preserving aspect ratio
            if (width > height) {
                if (width > THUMBNAIL_MAX_WIDTH) {
                    height *= THUMBNAIL_MAX_WIDTH / width;
                    width = THUMBNAIL_MAX_WIDTH;
                }
            } else {
                if (height > THUMBNAIL_MAX_HEIGHT) {
                    width *= THUMBNAIL_MAX_HEIGHT / height;
                    height = THUMBNAIL_MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            // Use JPEG for better compression for photos
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = dataUrl;
    });
}


export function getScanHistory(plan: SubscriptionPlan): ScanHistoryItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    if (plan === 'Free') {
        return history.slice(0, FREE_HISTORY_LIMIT);
    }
    return history;
  } catch (error) {
    console.error("Failed to parse scan history:", error);
    return [];
  }
}

export async function addScanToHistory(resultData: ScanResultData, plan: SubscriptionPlan): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    const thumbnailUrl = await createThumbnail(resultData.imageUrl);
    
    const { imageUrl, ...restOfResult } = resultData;

    const newItem: ScanHistoryItem = {
      ...restOfResult,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      imageUrl: thumbnailUrl,
    };
    
    let newHistory = [newItem, ...history];
    if (plan === 'Free') {
        newHistory = newHistory.slice(0, 50); // Keep more than 5 to allow upgrade
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

  } catch (error) {
    console.error("Failed to save scan to history:", error);
  }
}


export function getReportById(id: string): ScanHistoryItem | undefined {
  if (typeof window === 'undefined') return;
  const historyJson = localStorage.getItem(HISTORY_KEY);
  const history = historyJson ? JSON.parse(historyJson) : [];
  return history.find(report => report.id === id);
}
