"use client";

import React, { useState, useEffect } from 'react';
import ImageUploader from './components/image-uploader';
import ScanResult, { type ScanResultData } from './components/scan-result';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ScanPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  const handleImageUpload = (file: File) => {
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

  const handleScan = () => {
    setIsScanning(true);
    // Simulate API call
    setTimeout(() => {
      const results: ScanResultData[] = [
        {
          riskLevel: 'safe',
          copyrightStatus: 'Safe to use',
          license: 'CC0 (Public Domain)',
          detectedPlatforms: ['Pexels', 'Unsplash'],
          firstSeenDate: '2022-03-15',
          imageUrl: imagePreview!,
        },
        {
          riskLevel: 'attribution',
          copyrightStatus: 'Attribution needed',
          license: 'Creative Commons (BY)',
          detectedPlatforms: ['Flickr', 'Wikipedia'],
          firstSeenDate: '2021-08-20',
          imageUrl: imagePreview!,
        },
        {
          riskLevel: 'copyrighted',
          copyrightStatus: 'Copyrighted - not safe',
          license: 'Editorial Use Only',
          detectedPlatforms: ['Getty Images', 'Reuters'],
          firstSeenDate: '2020-01-10',
          imageUrl: imagePreview!,
        },
      ];
      setScanResult(results[Math.floor(Math.random() * results.length)]);
      setIsScanning(false);
    }, 3000);
  };

  const handleReset = () => {
    setImagePreview(null);
    setScanResult(null);
    setIsScanning(false);
  };

  useEffect(() => {
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
    <div className="flex flex-col h-full p-4">
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
