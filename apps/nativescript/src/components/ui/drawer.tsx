import * as React from 'react';
import { cn } from '@/lib/utils';
import { Screen, type View } from '@nativescript/core';
import { ModalLayer, Portal, Scrim, useEnter } from '@/components/ui/overlay';
import { Dialog, DialogClose, DialogTrigger, useDialog } from '@/components/ui/dialog';

// A bottom sheet with a grab handle (shadcn's Drawer, minus drag-to-close).
const Drawer = Dialog;
const DrawerTrigger = DialogTrigger;
const DrawerClose = DialogClose;

function DrawerPanel({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { setOpen } = useDialog();
  const panel = React.useRef<View>(null);
  useEnter(panel, { y: Screen.mainScreen.heightDIPs });
  return (
    <ModalLayer panelRef={panel} onDismiss={() => setOpen(false)}>
      <Scrim />
      <div
        ref={panel as never}
        className={cn(
          'absolute right-0 bottom-0 left-0 flex flex-col rounded-t-xl border-t border-border bg-background pb-6',
          className,
        )}
        {...props}
      >
        <div className="mt-4 h-1.5 w-24 self-center rounded-full bg-muted" />
        {children}
      </div>
    </ModalLayer>
  );
}

function DrawerContent(props: React.ComponentProps<'div'>) {
  const { open } = useDialog();
  if (!open) return null;
  return (
    <Portal>
      <DrawerPanel {...props} />
    </Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col items-center gap-1.5 p-4', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-center text-base font-semibold text-foreground', className)} {...props} />;
}

function DrawerDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-center text-sm text-muted-foreground', className)} {...props} />;
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
