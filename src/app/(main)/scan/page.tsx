
"use client";

import React, { useState, useEffect } from 'react';
import ImageUploader from './components/image-uploader';
import ScanResult, { type ScanResultData } from './components/scan-result';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { analyzeImageCopyright } from '@/ai/flows/analyze-image-copyright';
import { useToast } from "@/hooks/use-toast";
import { addScanToHistory } from '@/lib/history';

export default function ScanPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (const index in items) {
        const item = items[index];
        if (item.kind === 'file') {
            const blob = item.getAsFile();
            if (blob) {
                handleImageUpload(blob);
            }
        }
    }
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    setIsScanning(true);
    setScanResult(null); // Clear previous results
    try {
      const result = await analyzeImageCopyright({ imageDataUri: imagePreview });
      const fullResult: ScanResultData = { ...result, imageUrl: imagePreview };
      setScanResult(fullResult);
      // Now we save the result to history (with the image data)
      await addScanToHistory(fullResult);
    } catch (error) {
      console.error('Failed to scan image:', error);
       toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "There was an error analyzing the image. Please try again.",
      })
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setScanResult(null);
    setIsScanning(false);
  };

  useEffect(() => {
    // This effect allows pasting images directly
    const pasteHandler = (event: ClipboardEvent) => handlePaste(event as unknown as React.ClipboardEvent);
    window.addEventListener('paste', pasteHandler);
    return () => {
      window.removeEventListener('paste', pasteHandler);
    };
  }, []);


  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-in fade-in-50 duration-500">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <h2 className="text-2xl font-semibold mt-6">Scanning Image...</h2>
        <p className="text-muted-foreground mt-2">
          Our AI is analyzing the image. This may take a moment.
        </p>
      </div>
    );
  }

  if (scanResult) {
    return (
      <div className="p-4 animate-in fade-in-50 duration-500">
        <Button variant="ghost" onClick={handleReset} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Scan Another Image
        </Button>
        <ScanResult data={scanResult} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4" onPaste={handlePaste}>
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold font-headline">Scan Image</h1>
        <p className="text-muted-foreground mt-2">Upload an image to check its copyright status.</p>
      </div>
      <ImageUploader onImageUpload={handleImageUpload} imagePreview={imagePreview} />
      <div className="mt-auto pt-4">
        <Button
          onClick={handleScan}
          disabled={!imagePreview}
          size="lg"
          className="w-full rounded-full text-lg h-14 font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          Scan Now
        </Button>
      </div>
    </div>
  );
}
