import * as React from 'react';
import { cn } from '../../lib/utils';
import { isNative } from '../../lib/native';

function Spinner({ className, ...props }: React.ComponentProps<'div'>) {
  if (!isNative()) {
    return (
      <div
        className={cn('size-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
        {...props}
      />
    );
  }
  return <activityindicator busy className={cn('size-4 text-foreground', className)} {...props} />;
}

export { Spinner };
