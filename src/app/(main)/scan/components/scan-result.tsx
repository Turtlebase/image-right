
"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/shared/risk-badge';
import AiAdvice from './ai-advice';
import { User, Globe, Download, Share2, Info, FileQuestion, Loader2, Copy, Lock, Tv } from 'lucide-react';
import { type AnalyzeImageCopyrightOutput } from '@/ai/flows/analyze-image-copyright';
import { useToast } from "@/hooks/use-toast";
import { useRewardedAd } from '@/hooks/use-rewarded-ad';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from 'next-themes';
import { useSubscription } from '@/hooks/useSubscription';
import GeneratePost from './generate-post';


export type ScanResultData = AnalyzeImageCopyrightOutput & {
  imageUrl: string; // Can be a full data URI or a thumbnail data URI
};

interface ScanResultProps {
  data: ScanResultData;
}

export default function ScanResult({ data }: ScanResultProps): React.JSX.Element {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);
  const { isPremium } = useSubscription();
  const [isUnlocked, setIsUnlocked] = useState(isPremium);
  const showRewardedAd = useRewardedAd(state => state.showRewardedAd);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof navigator.share !== 'undefined') {
      setIsShareSupported(true);
    }
  }, []);
  
  useEffect(() => {
    if(isPremium) {
      setIsUnlocked(true);
    }
  }, [isPremium]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(reportRef.current, {
            useCORS: true,
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            scale: 2, // Increase scale for better quality
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('ImageRights_AI_Report.pdf');
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Download Failed",
            description: "An error occurred while creating the PDF.",
        });
    } finally {
        setIsDownloading(false);
    }
  };

  const getShareText = () => {
    return `ImageRights AI Scan Report:\n- Status: ${data.copyrightStatus}\n- Risk: ${data.riskLevel}\n- License: ${data.license}`;
  }

  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
            title: 'ImageRights AI Scan Report',
            text: shareText,
        });
      } catch (error) {
         const err = error as Error;
         if (err.name !== 'AbortError') {
             console.error("Share failed:", err);
             // Fallback to clipboard if share fails for other reasons
             await copyToClipboard(shareText);
         }
      }
    } else {
        await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard",
            description: "Report details have been copied.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Copy Failed",
            description: "Could not copy the report to your clipboard.",
        });
    }
  };
  
  const handleUnlock = () => {
    showRewardedAd({
      onReward: () => {
        setIsUnlocked(true);
        toast({
            title: "Result Unlocked!",
            description: "You can now view the full report.",
        });
      },
      onError: () => {
         toast({
            variant: "destructive",
            title: "Ad Failed to Load",
            description: "Please try again to unlock the report.",
        });
      }
    });
  };

  return (
    <>
      <div ref={reportRef} className="space-y-6 bg-background p-4 rounded-lg">
        <Card className="overflow-hidden shadow-lg">
          {data.imageUrl && data.imageUrl.startsWith('data:image') ? (
            <div className="relative h-64 w-full">
              <Image src={data.imageUrl} alt="Scanned image" layout="fill" objectFit="contain" data-ai-hint="scanned image result" />
            </div>
          ) : (
            <div className="h-48 w-full bg-muted flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
              <FileQuestion className="h-16 w-16" />
              <p className="mt-2 text-sm font-medium">Image not available in report</p>
              <p className="text-xs mt-1">To save storage, full images are not saved in scan history.</p>
            </div>
          )}
          <CardContent className="p-4">
            <RiskBadge riskLevel={data.riskLevel} />
            <p className="text-lg font-semibold mt-2">{data.copyrightStatus}</p>
          </CardContent>
        </Card>

        {isUnlocked && <GeneratePost imageUrl={data.imageUrl} />}

        {data.moderationInfo && (
          <Card className="bg-accent/20 border-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-accent-foreground">
                <Info className="h-5 w-5" />
                Moderation Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-accent-foreground/90">{data.moderationInfo}</p>
            </CardContent>
          </Card>
        )}

        {isUnlocked ? (
            <>
                <AiAdvice {...data} />

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <User className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Copyright Owner</p>
                        <p className="font-medium">{data.owner || 'Not Found'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">License</p>
                        <p className="font-medium">{data.license}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {data.copyrightedElements && data.copyrightedElements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Copyrighted Elements Detected</CardTitle>
                      <CardDescription>
                        Specific elements in this image may be protected by copyright.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {data.copyrightedElements.map((element, index) => (
                          <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                            {element}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {data.detectedOn && data.detectedOn.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold px-1">Detected On</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.detectedOn.map((site, index) => (
                        <a key={index} href={site.url} target="_blank" rel="noopener noreferrer" className="block">
                          <div className="bg-muted px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                            {site.domain}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </>
        ) : (
            <Card className="relative p-6 text-center border-2 border-dashed">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10"></div>
                <div className="relative z-20">
                    <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold">Unlock Full Report</h3>
                    <p className="text-muted-foreground mb-4">View AI advice, usage details, and detected sources.</p>
                    <Button onClick={handleUnlock}>
                        <Tv className="mr-2 h-5 w-5" />
                        Watch Ad to Unlock
                    </Button>
                </div>
            </Card>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button variant="outline" className="h-12 text-base" onClick={handleDownloadPdf} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
          {isDownloading ? 'Saving...' : 'PDF'}
        </Button>
        <Button className="h-12 text-base" onClick={handleShare}>
            {isShareSupported ? <Share2 className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
            {isShareSupported ? 'Share' : 'Copy'}
        </Button>
      </div>
    </>
  );
}
