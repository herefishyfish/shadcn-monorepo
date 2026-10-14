import * as React from 'react';
import { cn } from '../../lib/utils';

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border p-6', className)} {...props} />;
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex max-w-sm flex-col items-center gap-2', className)} {...props} />;
}

function EmptyMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mb-2 flex size-10 items-center justify-center rounded-lg bg-muted', className)} {...props} />;
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-center text-lg font-medium text-foreground', className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-center text-sm text-muted-foreground', className)} {...props} />;
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full max-w-sm flex-col items-center gap-4', className)} {...props} />;
}

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent };
