import * as React from 'react';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/ui/overlay';
import { Popover, PopoverPanel, PopoverTrigger, usePopover } from '@/components/ui/popover';

const DropdownMenu = Popover;
const DropdownMenuTrigger = PopoverTrigger;

function DropdownMenuContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open } = usePopover();
  if (!open) return null;
  return (
    <Portal>
      <PopoverPanel className={cn('min-w-32 p-1', className)} {...props} />
    </Portal>
  );
}

function DropdownMenuItem({
  className,
  variant = 'default',
  disabled,
  onSelect,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const { setOpen } = usePopover();
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent active:bg-accent',
        disabled && 'opacity-50',
        className,
      )}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        setOpen(false);
      }}
      {...props}
    >
      {/* Text gets a text element; elements (a shortcut, say) sit beside it. */}
      {React.Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number' ? (
          <span
            className={cn(
              'flex-1 text-sm',
              variant === 'destructive' ? 'text-destructive' : 'text-popover-foreground',
            )}
          >
            {child}
          </span>
        ) : (
          child
        ),
      )}
    </div>
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('px-2 py-1.5 text-sm font-medium text-foreground', className)} {...props} />
  );
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('-mx-1 my-1 h-[1] bg-border', className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-xs text-muted-foreground', className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
