import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { Slot } from '@/lib/slot';
import { useControllable } from '@/hooks/use-controllable';
import { ModalLayer, Portal, Scrim, useEnter } from '@/components/ui/overlay';

type DialogContextValue = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('Dialog parts must be inside <Dialog>.');
  return context;
}

type RootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

function Dialog({ open, defaultOpen = false, onOpenChange, children }: RootProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>{children}</DialogContext.Provider>
  );
}

type TriggerProps = React.ComponentProps<'div'> & { asChild?: boolean };

function DialogTrigger({ asChild, ...props }: TriggerProps) {
  const { setOpen } = useDialog();
  const Comp: any = asChild ? Slot : 'div';
  return <Comp {...props} onClick={() => setOpen(true)} />;
}

function DialogClose({ asChild, ...props }: TriggerProps) {
  const { setOpen } = useDialog();
  const Comp: any = asChild ? Slot : 'div';
  return <Comp {...props} onClick={() => setOpen(false)} />;
}

function DialogPanel({
  className,
  children,
  showCloseButton,
  dismissible,
  ...props
}: React.ComponentProps<'div'> & { showCloseButton: boolean; dismissible: boolean }) {
  const { setOpen } = useDialog();
  const panel = React.useRef<View>(null);
  useEnter(panel, { opacity: 0, scale: 0.95 });
  return (
    <ModalLayer
      className="flex items-center justify-center p-4"
      panelRef={panel}
      dismissible={dismissible}
      onDismiss={() => setOpen(false)}
    >
      <Scrim />
      <div
        ref={panel as never}
        className={cn(
          'relative flex w-full max-w-lg flex-col gap-4 rounded-lg border border-border bg-background p-6',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md opacity-70 active:bg-accent">
            <span className="text-base text-foreground">✕</span>
          </DialogClose>
        )}
      </div>
    </ModalLayer>
  );
}

function DialogContent({
  showCloseButton = true,
  ...props
}: React.ComponentProps<'div'> & { showCloseButton?: boolean }) {
  const { open } = useDialog();
  if (!open) return null;
  return (
    <Portal>
      <DialogPanel showCloseButton={showCloseButton} dismissible {...props} />
    </Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-row flex-wrap justify-end gap-2', className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  useDialog,
};
