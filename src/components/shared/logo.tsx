
import { cn } from "@/lib/utils";

export default function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <defs>
        <linearGradient
          id="grad1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "#29ABE2", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#9D69BB", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
            </feMerge>
        </filter>
      </defs>
      
      {/* Outer C shape */}
      <path
        d="M 96.3,16.3 A 48,48 0 1 0 96.3,111.7"
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      
      {/* Inner C shape */}
      <path
        d="M 82.5,41.5 A 24,24 0 1 0 82.5,86.5"
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      
      {/* Copyright symbol circle */}
      <circle cx="64" cy="64" r="5" fill="url(#grad1)" />
    </svg>
  );
}
