
"use client";

import React, { useState, useEffect } from 'react';
import ImageUploader from './components/image-uploader';
import ScanResult, { type ScanResultData } from './components/scan-result';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldAlert, Tv } from 'lucide-react';
import { analyzeImageCopyright } from '@/ai/flows/analyze-image-copyright';
import { useToast } from "@/hooks/use-toast";
import { addScanToHistory } from '@/lib/history';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRewardedAd } from '@/hooks/use-rewarded-ad';

export default function ScanPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
  const { toast } = useToast();
  const { subscription, recordScan, canScan, isInitialized } = useSubscription();
  const showRewardedAd = useRewardedAd(state => state.showRewardedAd);
  const isAdLoading = useRewardedAd(state => state.isAdLoading);

  const scanStatus = canScan();

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

  const performScan = async () => {
    if (!imagePreview) return;
    setIsScanning(true);
    setScanResult(null);
    try {
      // Don't record the scan if it's unlocked by an ad, as the ad itself is the "payment"
      if(canScan() === 'can_scan_free') {
        recordScan();
      }
      const result = await analyzeImageCopyright({ imageDataUri: imagePreview });
      const fullResult: ScanResultData = { ...result, imageUrl: imagePreview };
      setScanResult(fullResult);
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
  }

  const handleScan = async () => {
    if (scanStatus === 'can_scan_free') {
      await performScan();
    } else if (scanStatus === 'can_scan_with_ad') {
      showRewardedAd({
        onReward: async () => {
          toast({
            title: "Ad Complete!",
            description: "Your scan is starting now.",
          });
          // record the rewarded scan
          recordScan(); 
          await performScan();
        },
        onError: () => {
          toast({
              variant: "destructive",
              title: "Ad Failed to Load",
              description: "The rewarded ad could not be displayed. Please try again.",
          });
        }
      });
    } else {
        toast({
            variant: "destructive",
            title: "Daily Limit Reached",
            description: "You have used all your scans for today. Please try again tomorrow.",
        });
    }
  };

  const handleReset = () => {
    setImageFile(null);
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

  if (!isInitialized) {
    return (
       <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <h2 className="text-2xl font-semibold mt-6">Loading...</h2>
      </div>
    )
  }

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

  const renderScanButton = () => {
    const disabled = !imagePreview || isAdLoading;
    switch (scanStatus) {
        case 'can_scan_free':
            return <Button
                onClick={handleScan}
                disabled={disabled}
                size="lg"
                className="w-full rounded-full text-lg h-14 font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                Scan Now
              </Button>;
        case 'can_scan_with_ad':
            return <Button
                onClick={handleScan}
                disabled={disabled}
                size="lg"
                className="w-full rounded-full text-lg h-14 font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              >
                {isAdLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Tv className="h-5 w-5" />}
                {isAdLoading ? 'Loading Ad...' : 'Watch Ad to Scan'}
              </Button>;
        case 'limit_reached':
             return null;
    }
  }

  const scansLeft = subscription.rewardedScanLimit - subscription.scansToday;
  
  const scansLeftText = scanStatus === 'can_scan_free' 
    ? `${subscription.freeScanLimit - subscription.scansToday} free scans remaining`
    : `${scansLeft} rewarded scans remaining`;


  return (
    <div className="flex flex-col h-full p-4" onPaste={handlePaste}>
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold font-headline">Scan Image</h1>
        <p className="text-muted-foreground mt-2">Upload an image to check its copyright status.</p>
      </div>
       {scanStatus === 'limit_reached' ? (
          <Card className="border-destructive/50 bg-destructive/10 text-center p-6">
            <CardHeader className="p-0">
              <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-2" />
              <CardTitle className="text-destructive">Daily Limit Reached</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <p className="text-destructive/90 mb-4">
                You've used all your {subscription.rewardedScanLimit} available scans for today. Please come back tomorrow.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <ImageUploader onImageUpload={handleImageUpload} imagePreview={imagePreview} />
            <div className="mt-auto pt-4">
              <p className="text-center text-sm text-muted-foreground mb-2">
                {scansLeftText}
              </p>
              {renderScanButton()}
            </div>
          </>
        )}
    </div>
  );
}
