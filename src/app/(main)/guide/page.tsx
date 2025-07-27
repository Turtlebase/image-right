import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ScanLine, ShieldCheck, Download } from 'lucide-react';

const guideSteps = [
  {
    icon: Upload,
    title: '1. Upload Image',
    description: 'Tap to select an image, or simply drag-and-drop it into the app.',
  },
  {
    icon: ScanLine,
    title: '2. One-Tap Scan',
    description: 'Our AI performs a deep-dive search across the web to find copyright and license data.',
  },
  {
    icon: ShieldCheck,
    title: '3. View Results',
    description: 'Get a clear, color-coded report on whether the image is safe to use.',
  },
  {
    icon: Download,
    title: '4. Save & Share',
    description: 'Download a PDF report or share a link to your results with one tap.',
  },
];

export default function GuidePage() {
  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
      <div className="my-8 text-center">
        <h1 className="text-3xl font-bold font-headline">How It Works</h1>
        <p className="text-muted-foreground mt-2">A simple guide to checking image rights.</p>
      </div>

      <div className="space-y-6">
        {guideSteps.map((step, index) => (
          <Card key={index} className="shadow-md bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
