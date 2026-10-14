import * as React from 'react';
import { cn } from '../../lib/utils';

function Progress({ className, value = 0, ...props }: React.ComponentProps<'div'> & { value?: number }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-primary/20', className)} {...props}>
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export { Progress };
