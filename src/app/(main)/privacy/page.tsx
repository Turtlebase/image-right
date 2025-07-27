import { type Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Read the Privacy Policy for ImageRights AI.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="p-4 animate-in fade-in-50 duration-500">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>

            <h3 className="font-bold text-lg">Interpretation and Definitions</h3>
            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className="font-bold text-lg">Collecting and Using Your Personal Data</h3>
            <p>We do not collect any personally identifiable information. All data processed by our AI for image analysis is done on-the-fly and is not stored or associated with any individual. Your scan history is stored only on your local device and is not transmitted to our servers.</p>

            <h3 className="font-bold text-lg">Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
            <ul>
                <li>By email: ecoliwears@gmail.com</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
