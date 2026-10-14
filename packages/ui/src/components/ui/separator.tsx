import * as React from 'react';
import { cn } from '../../lib/utils';

// 1dp thick: `h-px` would be one physical pixel.
function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1] w-full' : 'w-[1] self-stretch',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
