import * as React from 'react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav className={cn('flex w-full flex-row justify-center', className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex', className)} {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: React.ComponentProps<'button'> & { isActive?: boolean; size?: 'default' | 'icon' }) {
  return (
    <button
      className={cn(buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }), className)}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <PaginationLink size="default" className={cn('gap-1 px-2.5', className)} {...props}>
      ‹ Previous
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <PaginationLink size="default" className={cn('gap-1 px-2.5', className)} {...props}>
      Next ›
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('size-9 text-center text-sm text-muted-foreground', className)} {...props}>
      …
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
