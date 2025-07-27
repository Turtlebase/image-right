import { type Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Terms of Use',
    description: 'Read the Terms of Use for ImageRights AI.',
};

export default function TermsOfUsePage() {
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
          <CardTitle>Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p><strong>Last updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>Please read these terms and conditions carefully before using Our Service.</p>

            <h3 className="font-bold text-lg">Acknowledgment</h3>
            <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>

            <h3 className="font-bold text-lg">Disclaimer</h3>
            <p>The information provided by ImageRights AI is for informational purposes only and does not constitute legal advice. We make no guarantees as to the accuracy of the copyright information provided. You are responsible for ensuring your use of any image is compliant with all applicable laws and license terms.</p>

            <h3 className="font-bold text-lg">Contact Us</h3>
            <p>If you have any questions about these Terms, You can contact us:</p>
            <ul>
                <li>By email: ecoliwears@gmail.com</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
