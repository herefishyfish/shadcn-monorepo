import * as React from 'react';
import { Screen, type View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { ModalLayer, Portal, Scrim, useEnter } from '@/components/ui/overlay';
import { Dialog, DialogClose, DialogTrigger, useDialog } from '@/components/ui/dialog';

const Sheet = Dialog;
const SheetTrigger = DialogTrigger;
const SheetClose = DialogClose;

type Side = 'top' | 'right' | 'bottom' | 'left';

const sideClasses: Record<Side, string> = {
  right: 'top-0 right-0 bottom-0 w-3/4 max-w-sm border-l',
  left: 'top-0 bottom-0 left-0 w-3/4 max-w-sm border-r',
  top: 'top-0 right-0 left-0 border-b',
  bottom: 'right-0 bottom-0 left-0 border-t',
};

function SheetPanel({
  side,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { side: Side }) {
  const { setOpen } = useDialog();
  const panel = React.useRef<View>(null);
  const width = Screen.mainScreen.widthDIPs;
  const height = Screen.mainScreen.heightDIPs;
  useEnter(panel, {
    x: side === 'right' ? width : side === 'left' ? -width : 0,
    y: side === 'bottom' ? height : side === 'top' ? -height : 0,
  });
  return (
    <ModalLayer panelRef={panel} onDismiss={() => setOpen(false)}>
      <Scrim />
      <div
        ref={panel as never}
        className={cn(
          'absolute flex flex-col gap-4 border-border bg-background',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md opacity-70 active:bg-accent">
          <span className="text-base text-foreground">✕</span>
        </SheetClose>
      </div>
    </ModalLayer>
  );
}

function SheetContent({ side = 'right', ...props }: React.ComponentProps<'div'> & { side?: Side }) {
  const { open } = useDialog();
  if (!open) return null;
  return (
    <Portal>
      <SheetPanel side={side} {...props} />
    </Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-base font-semibold text-foreground', className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
