import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { Slot } from '@/lib/slot';
import { useControllable } from '@/hooks/use-controllable';
import { ModalLayer, Portal, useAnchorPosition, useEnter } from '@/components/ui/overlay';

type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: React.RefObject<View | null>;
};
const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error('Popover parts must be inside <Popover>.');
  return context;
}

function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const anchor = React.useRef<View>(null);
  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, anchor }}>
      {children}
    </PopoverContext.Provider>
  );
}

/** Opens the popover; the popover is placed against it. */
function PopoverTrigger({ asChild, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const { open, setOpen, anchor } = usePopover();
  const Comp: any = asChild ? Slot : 'div';
  // A wrapper, so the anchor can be measured whatever the child is.
  return (
    <div ref={anchor as never} className="flex flex-col self-start">
      <Comp {...props} onClick={() => setOpen(!open)} />
    </div>
  );
}

function PopoverPanel({ className, ...props }: React.ComponentProps<'div'>) {
  const { setOpen, anchor } = usePopover();
  const panel = React.useRef<View>(null);
  const { style: position, onPanelLayout } = useAnchorPosition(anchor);
  useEnter(panel, { opacity: 0, scale: 0.96 });
  return (
    <ModalLayer panelRef={panel} onDismiss={() => setOpen(false)}>
      <div
        ref={panel as never}
        className={cn(
          'absolute flex flex-col rounded-md border border-border bg-popover text-popover-foreground',
          !position && 'opacity-0',
          className,
        )}
        style={position ?? undefined}
        onLayoutChanged={onPanelLayout}
        {...props}
      />
    </ModalLayer>
  );
}

function PopoverContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open } = usePopover();
  if (!open) return null;
  return (
    <Portal>
      <PopoverPanel className={cn('w-72 gap-2 p-4', className)} {...props} />
    </Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverPanel, usePopover };
