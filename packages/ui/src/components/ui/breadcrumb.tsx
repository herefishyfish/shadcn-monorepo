import * as React from 'react';
import { cn } from '../../lib/utils';

function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav className={cn('flex flex-row', className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row flex-wrap items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-1.5', className)} {...props} />;
}

function BreadcrumbLink({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm text-muted-foreground active:text-foreground', className)} {...props} />;
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm text-foreground', className)} {...props} />;
}

function BreadcrumbSeparator({ className, children, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children ?? '›'}
    </span>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-sm text-muted-foreground', className)} {...props}>
      …
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
