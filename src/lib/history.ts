import { db, storage } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { type AnalyzeImageCopyrightOutput } from "@/ai/flows/analyze-image-copyright";
import { type ScanResultData } from "@/app/(main)/scan/components/scan-result";

const HISTORY_COLLECTION = 'scanHistory';

export interface ScanHistoryItem extends AnalyzeImageCopyrightOutput {
  id: string;
  date: string;
  imageUrl: string;
  thumbnailUrl?: string; // Optional: for list view optimization
}

export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  try {
    const q = query(collection(db, HISTORY_COLLECTION), orderBy("date", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    const history: ScanHistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as ScanHistoryItem);
    });
    return history;
  } catch (error) {
    console.error("Error fetching scan history from Firestore:", error);
    return [];
  }
}

export async function addScanToHistory(resultData: ScanResultData): Promise<void> {
  if (!resultData.imageUrl) {
    console.error("Cannot save to history: imageUrl is missing.");
    return;
  }

  try {
    // 1. Upload the full-resolution image to Firebase Storage
    const imageName = `${new Date().toISOString()}-${Math.random()}.jpg`;
    const storageRef = ref(storage, `${HISTORY_COLLECTION}/${imageName}`);
    const uploadResult = await uploadString(storageRef, resultData.imageUrl, 'data_url');
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    // 2. Create the result object without the local data URI
    const { imageUrl, ...resultToSave } = resultData;

    const newItem = {
      ...resultToSave,
      imageUrl: downloadUrl, // Store the public URL from Firebase Storage
      date: new Date().toISOString(),
    };

    // 3. Save the scan metadata to Firestore
    await addDoc(collection(db, HISTORY_COLLECTION), newItem);

  } catch (error) {
    console.error("Failed to save scan to Firebase:", error);
  }
}

// Note: getReportById will need to be adapted if you want to fetch a single
// document from Firestore by its ID. For now, the reports page will fetch the
// full list and the detail page will find the report from that list.
// A more optimized approach would be to fetch the single doc by ID.
