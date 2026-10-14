import * as React from 'react';
import { cn } from '../../lib/utils';

// Flex rows, not a native table: give columns widths with basis-*/flex-* on cells.

function Table({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col', className)} {...props} />;
}

function TableHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col border-b border-border', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col border-t border-border bg-muted/50', className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center border-b border-border', className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('flex-1 px-2 py-2.5 text-sm font-medium text-foreground', className)} {...props} />;
}

function TableCell({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('flex-1 p-2 text-sm text-foreground', className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('mt-4 text-center text-sm text-muted-foreground', className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption };
