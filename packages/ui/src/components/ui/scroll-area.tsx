import * as React from 'react';
import { cn } from '../../lib/utils';
import { isNative } from '../../lib/native';

/** MasonKit scrolls with <scroll>. Browsers scroll an overflow div. */
function ScrollArea({ className, ...props }: React.ComponentProps<'div'>) {
  const classes = cn('relative min-h-0 overflow-auto', className);
  if (!isNative()) return <div className={classes} {...props} />;
  return <scroll className={classes} {...(props as React.ComponentProps<'div'>)} />;
}

export { ScrollArea };
