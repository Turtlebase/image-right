import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, ShieldX, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  riskLevel: 'safe' | 'attribution' | 'copyrighted';
  className?: string;
}

const riskConfig = {
  safe: {
    icon: ShieldCheck,
    label: 'Safe to Use',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  attribution: {
    icon: ShieldAlert,
    label: 'Attribution Needed',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  copyrighted: {
    icon: ShieldX,
    label: 'Copyrighted',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  unknown: {
    icon: HelpCircle,
    label: 'Unknown',
    className: 'bg-muted text-muted-foreground border-border',
  }
};

export default function RiskBadge({ riskLevel, className }: RiskBadgeProps) {
  const config = riskConfig[riskLevel] || riskConfig.unknown;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{config.label}</span>
    </div>
  );
}
