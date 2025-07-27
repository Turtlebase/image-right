
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { type ScanHistoryItem } from '@/lib/history';
import ScanResult, { type ScanResultData } from '@/app/(main)/scan/components/scan-result';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


function ReportDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<ScanHistoryItem | null>(null);

  useEffect(() => {
    const reportJson = searchParams.get('report');
    if (reportJson) {
      try {
        const parsedReport = JSON.parse(decodeURIComponent(reportJson));
        setReport(parsedReport);
      } catch (error) {
        console.error("Failed to parse report data:", error);
        router.push('/reports');
      }
    } else {
        // If no report data, redirect back to the main reports page.
        router.push('/reports');
    }
  }, [searchParams, router]);

  if (!report) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  // Adapt the history item to the format expected by ScanResult.
  // The imageUrl will be missing, and ScanResult is designed to handle this.
  const resultData: ScanResultData = {
    ...report,
    imageUrl: report.imageUrl || '', // Pass an empty string if imageUrl is not available
  };


  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
      <Button variant="ghost" onClick={() => router.push('/reports')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reports
      </Button>
      <ScanResult data={resultData} />
    </div>
  );
}


export default function ReportDetailPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading report...</div>}>
            <ReportDetailContent />
        </Suspense>
    )
}
