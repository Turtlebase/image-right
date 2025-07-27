import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import RiskBadge from '@/components/shared/risk-badge';
import Link from 'next/link';

const mockReports = [
  { id: '1', riskLevel: 'safe', date: '2023-10-26', imageUrl: 'https://placehold.co/400x300', 'data-ai-hint': 'abstract gradient' },
  { id: '2', riskLevel: 'attribution', date: '2023-10-25', imageUrl: 'https://placehold.co/400x300', 'data-ai-hint': 'neon lights' },
  { id: '3', riskLevel: 'copyrighted', date: '2023-10-24', imageUrl: 'https://placehold.co/400x300', 'data-ai-hint': 'city skyline' },
  { id: '4', riskLevel: 'safe', date: '2023-10-23', imageUrl: 'https://placehold.co/400x300', 'data-ai-hint': 'forest path' },
];

export default function ReportsPage() {
  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Scan History</h1>
        <p className="text-muted-foreground mt-2">Review your past image scans.</p>
      </div>
      
      <div className="space-y-4">
        {mockReports.map((report) => (
          <Link href="#" key={report.id} className="block group">
            <Card className="overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:scale-[1.02] active:scale-100 shadow-md hover:shadow-primary/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={report.imageUrl}
                    alt={`Report ${report.id}`}
                    layout="fill"
                    className="rounded-lg object-cover"
                    data-ai-hint={report['data-ai-hint']}
                  />
                </div>
                <div className="flex-grow">
                  <RiskBadge riskLevel={report.riskLevel as any} />
                  <p className="text-sm text-muted-foreground mt-2">Scanned on: {report.date}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
