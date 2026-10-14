import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { Portal, useAnchorPosition, useEnter } from '@/components/ui/overlay';
import { Popover, usePopover } from '@/components/ui/popover';

/*
 * Opens while the pointer is over the trigger where the platform reports
 * hover (Windows), and on long-press with touch, where it closes on its own
 * after a moment. It renders in the floating layer, so it never covers the
 * trigger and steals the pointer from it.
 */
function TooltipProvider({ children }: { children?: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

const Tooltip = Popover;

function TooltipTrigger({ asChild, children, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const { setOpen, anchor } = usePopover();
  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onLongPress: () => setOpen(true),
  };
  // The handlers go on the child too: a button takes the touch, so the
  // wrapper (there to be measured) wouldn't see the long-press.
  const child = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, handlers)
    : children;
  return (
    <div ref={anchor as never} className="flex flex-col self-start" {...handlers} {...props}>
      {child}
    </div>
  );
}

function TooltipBubble({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { setOpen, anchor } = usePopover();
  const ref = React.useRef<View>(null);
  const { style: position, onPanelLayout } = useAnchorPosition(anchor);
  useEnter(ref, { opacity: 0, scale: 0.96 });
  React.useEffect(() => {
    // Long-press has no "leave"; close after a moment. Hover keeps it open.
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      ref={ref as never}
      className={cn('absolute rounded-md bg-primary px-3 py-1.5', !position && 'opacity-0', className)}
      style={position ? { ...position, minWidth: undefined } : undefined}
      onLayoutChanged={onPanelLayout}
      {...props}
    >
      <span className="text-xs text-primary-foreground">{children}</span>
    </div>
  );
}

function TooltipContent(props: React.ComponentProps<'div'>) {
  const { open } = usePopover();
  if (!open) return null;
  return (
    <Portal floating>
      <TooltipBubble {...props} />
    </Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
