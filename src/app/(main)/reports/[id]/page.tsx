
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReportById, type ScanHistoryItem } from '@/lib/history';
import ScanResult, { type ScanResultData } from '@/app/(main)/scan/components/scan-result';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ScanHistoryItem | null>(null);

  useEffect(() => {
    if (params.id) {
      const foundReport = getReportById(params.id as string);
      if (foundReport) {
        setReport(foundReport);
      } else {
        // Handle case where report is not found, maybe redirect
        router.push('/reports');
      }
    }
  }, [params.id, router]);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading report...</p>
      </div>
    );
  }

  // Since we are no longer storing the image URL in history,
  // we can create a placeholder or use a default image if needed.
  // For now, let's just use the data without the image.
  // The ScanResult component is designed to handle a missing imageUrl.
  const resultData: ScanResultData = {
    ...report.result
  };


  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/reports">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>
      {/* We pass the data without the image URL */}
      <ScanResult data={resultData} />
    </div>
  );
}
