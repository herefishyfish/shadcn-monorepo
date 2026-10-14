import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// `active:` mirrors `hover:` so touch screens get press feedback too.
const buttonVariants = cva(
  'flex shrink-0 flex-row items-center justify-center gap-2 rounded-md text-center text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/90',
        outline:
          'border border-border bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/80',
        ghost:
          'bg-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent dark:hover:bg-accent/50',
        link: 'bg-transparent text-primary underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 gap-1.5 px-3',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  disabled,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
      disabled={disabled}
      isEnabled={!disabled}
      {...props}
    />
  );
}

export { Button, buttonVariants };
