"use client";

import { useState, useEffect } from 'react';
import { generateAiUsageAdvice } from '@/ai/flows/generate-ai-usage-advice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { type ScanResultData } from './scan-result';

export default function AiAdvice(props: ScanResultData) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAdvice() {
      try {
        setLoading(true);
        const result = await generateAiUsageAdvice(props);
        setAdvice(result.usageAdvice);
      } catch (error) {
        console.error('Failed to get AI advice:', error);
        setAdvice('Could not load advice at this time.');
      } finally {
        setLoading(false);
      }
    }
    getAdvice();
  }, [props]);

  return (
    <Card className="bg-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Usage Advice
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-foreground/90">{advice}</p>
        )}
      </CardContent>
    </Card>
  );
}
