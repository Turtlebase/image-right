"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import RiskBadge from '@/components/shared/risk-badge';
import AiAdvice from './ai-advice';
import { Calendar, Globe, Download, Share2 } from 'lucide-react';

export type ScanResultData = {
  riskLevel: 'safe' | 'attribution' | 'copyrighted';
  copyrightStatus: string;
  license: string;
  detectedPlatforms: string[];
  firstSeenDate: string;
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
          <Image src={data.imageUrl} alt="Scanned image" layout="fill" objectFit="cover" data-ai-hint="abstract texture"/>
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
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">First Seen</p>
              <p className="font-medium">{data.firstSeenDate}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">License</p>
              <p className="font-medium">{data.license}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detected On</CardTitle>
        </CardHeader>
        <CardContent>
          <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {data.detectedPlatforms.map((platform, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="bg-muted p-4 rounded-lg text-center font-medium">
                      {platform}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 text-base"><Download className="mr-2 h-5 w-5"/> PDF</Button>
          <Button className="h-12 text-base"><Share2 className="mr-2 h-5 w-5"/> Share</Button>
      </div>
    </div>
  );
}
