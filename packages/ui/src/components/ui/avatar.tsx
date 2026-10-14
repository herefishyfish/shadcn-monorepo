import * as React from 'react';
import { cn } from '../../lib/utils';

function Avatar({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentProps<'img'>) {
  return <img className={cn('absolute inset-0 size-full', className)} {...props} />;
}

// Sits under AvatarImage, so it shows until (or unless) the image loads.
function AvatarFallback({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      {...props}
    >
      <span className="text-sm text-foreground">{children}</span>
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
