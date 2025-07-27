"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/shared/risk-badge';
import AiAdvice from './ai-advice';
import { Calendar, Globe, Download, Share2, Search, Link as LinkIcon, User, Info } from 'lucide-react';
import { type AnalyzeImageCopyrightOutput } from '@/ai/flows/analyze-image-copyright';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
      
      {data.moderationInfo && (
        <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-400">
                    <Info className="h-5 w-5" />
                    Moderation Info
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/90">{data.moderationInfo}</p>
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
        <div className="space-y-3">
          <h2 className="text-xl font-bold font-headline px-1">Detected On</h2>
           <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {data.detectedOn.map((site, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                       <Link href={site.url} target="_blank" rel="noopener noreferrer" className="block group">
                          <Card className="overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-primary/20">
                            <CardContent className="p-4 flex items-center gap-3">
                               <div className="p-2 bg-muted rounded-lg">
                                 <Search className="h-5 w-5 text-muted-foreground" />
                               </div>
                               <div className="flex-grow overflow-hidden">
                                 <p className="font-medium truncate">{site.domain}</p>
                                 <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-primary">{site.url}</p>
                               </div>
                            </CardContent>
                          </Card>
                       </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 text-base"><Download className="mr-2 h-5 w-5"/> PDF</Button>
          <Button className="h-12 text-base"><Share2 className="mr-2 h-5 w-5"/> Share</Button>
      </div>
    </div>
  );
}
