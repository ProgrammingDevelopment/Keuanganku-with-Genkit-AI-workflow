import { Landmark } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps extends LucideProps {
  showText?: boolean;
}

export function AppLogo({ className, showText = false, ...props }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Landmark className={cn("h-8 w-8", props.className)} {...props} />
      {showText && <span className="text-xl font-bold text-primary">KeuanganKu</span>}
    </div>
  );
}
