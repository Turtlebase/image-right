
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import RiskBadge from '@/components/shared/risk-badge';
import { getScanHistory, type ScanHistoryItem } from '@/lib/history';
import { FileSearch, Loader2, ImageOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

export default function ReportsPage() {
  const [reports, setReports] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isInitialized } = useSubscription();

  useEffect(() => {
    // History is loaded only on the client-side
    async function fetchHistory() {
      try {
        const history = getScanHistory();
        setReports(history);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isInitialized) {
        fetchHistory();
    }
  }, [isInitialized]);

  const handleReportClick = (report: ScanHistoryItem) => {
    // Pass the full report object via query params
    const reportJson = encodeURIComponent(JSON.stringify(report));
    router.push(`/reports/detail?report=${reportJson}`);
  };


  if (loading || !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Scan History</h1>
        <p className="text-muted-foreground mt-2">Review your past image scans.</p>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
            <FileSearch className="h-16 w-16 mb-4 text-primary/50"/>
            <h3 className="text-xl font-semibold text-foreground">No Reports Yet</h3>
            <p className="mt-2 max-w-xs">Your past scan results will appear here after you scan an image.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <button key={report.id} onClick={() => handleReportClick(report)} className="w-full text-left block group">
              <Card className="overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-primary/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {report.imageUrl ? (
                        <Image
                            src={report.imageUrl}
                            alt="Scanned image thumbnail"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                    ) : (
                        <ImageOff className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <RiskBadge riskLevel={report.riskLevel} />
                    <p className="text-sm text-muted-foreground mt-2">Scanned on: {new Date(report.date).toLocaleDateString()}</p>
                    <p className="text-sm font-medium text-foreground truncate mt-1">{report.copyrightStatus}</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
