import * as React from 'react';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/ui/overlay';
import { Popover, PopoverPanel, usePopover } from '@/components/ui/popover';
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';

// Opens on long-press (touch or mouse); NativeScript has no right-click event.
const ContextMenu = Popover;
const ContextMenuItem = DropdownMenuItem;
const ContextMenuLabel = DropdownMenuLabel;
const ContextMenuSeparator = DropdownMenuSeparator;
const ContextMenuShortcut = DropdownMenuShortcut;

function ContextMenuTrigger({ className, ...props }: React.ComponentProps<'div'>) {
  const { setOpen, anchor } = usePopover();
  return (
    <div
      ref={anchor as never}
      className={cn('flex flex-col', className)}
      onLongPress={() => setOpen(true)}
      {...props}
    />
  );
}

function ContextMenuContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open } = usePopover();
  if (!open) return null;
  return (
    <Portal>
      <PopoverPanel className={cn('min-w-32 p-1', className)} {...props} />
    </Portal>
  );
}

export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
};
