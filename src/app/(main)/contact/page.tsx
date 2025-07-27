import { type Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the ImageRights AI team.',
};

export default function ContactPage() {
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
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Have questions or feedback? We'd love to hear from you.</p>

            <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <a href="mailto:ecoliwears@gmail.com" className="font-semibold text-primary hover:underline">
                    ecoliwears@gmail.com
                </a>
            </div>
            
            <Button asChild className="w-full">
                <a href="mailto:ecoliwears@gmail.com">
                    <Send className="mr-2 h-4 w-4"/>
                    Send an Email
                </a>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
