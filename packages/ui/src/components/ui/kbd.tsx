import * as React from 'react';
import { cn } from '../../lib/utils';

function Kbd({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('h-5 min-w-5 self-start rounded-sm bg-muted px-1 text-center text-xs font-medium text-muted-foreground', className)} {...props} />;
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

export { Kbd, KbdGroup };
