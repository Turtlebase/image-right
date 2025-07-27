
"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/shared/risk-badge';
import AiAdvice from './ai-advice';
import { User, Globe, Download, Share2, Info, FileQuestion, Loader2 } from 'lucide-react';
import { type AnalyzeImageCopyrightOutput } from '@/ai/flows/analyze-image-copyright';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from 'next-themes';

export type ScanResultData = AnalyzeImageCopyrightOutput & {
  imageUrl: string; // Can be a full data URI or a thumbnail data URI
};

interface ScanResultProps {
  data: ScanResultData;
}

export default function ScanResult({ data }: ScanResultProps): React.JSX.Element {
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator.share !== 'undefined' && typeof navigator.canShare !== 'undefined') {
        const shareData = {
          title: 'ImageRights AI Scan Report',
          text: `Here's my image copyright report:\n- Status: ${data.copyrightStatus}\n- Risk Level: ${data.riskLevel}\n- License: ${data.license}`,
        };
        if (navigator.canShare(shareData)) {
          setCanShare(true);
        }
    }
  }, [data]);

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportElement, { 
        useCORS: true,
        scale: 2,
        backgroundColor: resolvedTheme === 'dark' ? '#18181b' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      pdf.save(`ImageRights-AI-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate the PDF report. Please try again.",
      })
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'ImageRights AI Scan Report',
      text: `Here's my image copyright report:\n- Status: ${data.copyrightStatus}\n- Risk Level: ${data.riskLevel}\n- License: ${data.license}`,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error("Web Share API not supported or data cannot be shared.");
      }
    } catch (error) {
       if ((error as Error).name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Sharing Failed",
          description: "Could not share the report at this time.",
        });
      }
    }
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
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button variant="outline" className="h-12 text-base" onClick={handleDownloadPdf} disabled={isDownloading}>
          {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
          {isDownloading ? 'Saving...' : 'PDF'}
        </Button>
        <Button className="h-12 text-base" onClick={handleShare} disabled={!canShare}>
          <Share2 className="mr-2 h-5 w-5" /> Share
        </Button>
      </div>
    </>
  );
}
