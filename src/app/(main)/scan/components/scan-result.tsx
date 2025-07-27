"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/shared/risk-badge';
import AiAdvice from './ai-advice';
import { Calendar, Globe, Download, Share2, Search, Link as LinkIcon, User } from 'lucide-react';
import { type AnalyzeImageCopyrightOutput } from '@/ai/flows/analyze-image-copyright';

export type ScanResultData = AnalyzeImageCopyrightOutput & {
  imageUrl: string;
};

interface ScanResultProps {
  data: ScanResultData;
}

export default function ScanResult({ data }: ScanResultProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-64 w-full">
          <Image src={data.imageUrl} alt="Scanned image" layout="fill" objectFit="cover" data-ai-hint="scanned image result"/>
        </div>
        <CardContent className="p-4">
          <RiskBadge riskLevel={data.riskLevel} />
          <p className="text-lg font-semibold mt-2">{data.copyrightStatus}</p>
        </CardContent>
      </Card>
      
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
        <Card>
          <CardHeader>
            <CardTitle>Detected On</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {data.detectedOn.map((site, index) => (
                <Link href={site.url} target="_blank" rel="noopener noreferrer" key={index} className="block group">
                  <div className="flex items-center gap-4 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-grow">
                      <p className="font-medium">{site.domain}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-primary">{site.url}</p>
                    </div>
                     <LinkIcon className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 text-base"><Download className="mr-2 h-5 w-5"/> PDF</Button>
          <Button className="h-12 text-base"><Share2 className="mr-2 h-5 w-5"/> Share</Button>
      </div>
    </div>
  );
}
