import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';
import { Input } from './input';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      className={cn(
        'flex h-9 w-full flex-row items-center rounded-md border border-input dark:bg-input/30',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('h-full flex-1 rounded-none border-0 bg-transparent dark:bg-transparent', className)}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & { align?: 'inline-start' | 'inline-end' }) {
  return (
    <div
      className={cn(
        'flex h-full flex-row items-center gap-2',
        align === 'inline-start' ? 'order-first pl-3' : 'order-last pr-2',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function InputGroupButton({ className, size, variant = 'ghost', ...props }: React.ComponentProps<typeof Button>) {
  return <Button variant={variant} className={cn('h-6 gap-1 rounded-sm px-2', className)} {...props} />;
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText };
