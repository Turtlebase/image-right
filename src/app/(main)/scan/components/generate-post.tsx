
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Copy, Loader2, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';
import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import { useToast } from '@/hooks/use-toast';

interface GeneratePostProps {
  imageUrl: string;
}

interface PostResult {
    caption: string;
    hashtags: string[];
}

export default function GeneratePost({ imageUrl }: GeneratePostProps) {
  const [result, setResult] = useState<PostResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePost = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateSocialMediaPost({ imageDataUri: imageUrl });
      setResult(response);
    } catch (error) {
      console.error('Failed to generate post:', error);
      toast({
        variant: 'destructive',
        title: 'Post Generation Failed',
        description: 'The AI could not generate a post at this time. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          AI Social Media Post
        </CardTitle>
        <CardDescription>
          Generate an engaging caption and hashtags for this image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result ? (
            <div className="space-y-4 animate-in fade-in-50">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Generated Caption</h4>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(result.caption)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <Textarea
                        readOnly
                        value={result.caption}
                        className="w-full h-32 bg-background/50"
                    />
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Suggested Hashtags</h4>
                     <div className="flex flex-wrap gap-2">
                        {result.hashtags.map((tag, index) => (
                          <button key={index} onClick={() => handleCopy(tag)} className="bg-muted px-3 py-1 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
                            {tag}
                          </button>
                        ))}
                      </div>
                </div>

                <Button variant="outline" onClick={handleGeneratePost} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Regenerate
                </Button>
            </div>
        ) : (
             <Button onClick={handleGeneratePost} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Bot className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Generating...' : 'Generate Post'}
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
