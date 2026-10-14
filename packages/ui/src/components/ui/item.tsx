import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const itemVariants = cva('flex flex-row flex-wrap items-center rounded-md border', {
  variants: {
    variant: {
      default: 'border-transparent bg-transparent',
      outline: 'border-border',
      muted: 'border-transparent bg-muted/50',
    },
    size: {
      default: 'gap-4 p-4',
      sm: 'gap-2.5 px-4 py-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

function Item({ className, variant, size, ...props }: React.ComponentProps<'div'> & VariantProps<typeof itemVariants>) {
  return <div className={cn(itemVariants({ variant, size }), className)} {...props} />;
}

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & { variant?: 'default' | 'icon' | 'image' }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center',
        variant === 'icon' && 'size-8 rounded-sm border border-border bg-muted',
        variant === 'image' && 'size-10 overflow-hidden rounded-sm',
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 flex-col gap-1', className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm font-medium text-foreground', className)} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-row items-center gap-2', className)} {...props} />;
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-row items-center justify-between gap-2', className)} {...props} />;
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-row items-center justify-between gap-2', className)} {...props} />;
}

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />;
}

function ItemSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('my-0 h-[1] w-full bg-border', className)} {...props} />;
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
