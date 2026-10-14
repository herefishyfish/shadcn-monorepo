import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@/lib/slot';
import { Portal } from '@/components/ui/overlay';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from '@/components/ui/dialog';

// A Dialog that only an action or Cancel closes: no close button, and taps on
// the backdrop (or Android's back button) are ignored.
const AlertDialog = Dialog;
const AlertDialogTrigger = DialogTrigger;
const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

function AlertDialogContent(props: React.ComponentProps<'div'>) {
  const { open } = useDialog();
  if (!open) return null;
  return (
    <Portal>
      <DialogPanel showCloseButton={false} dismissible={false} {...props} />
    </Portal>
  );
}

type ActionProps = React.ComponentProps<'button'> & { asChild?: boolean };

function AlertDialogAction({ className, onClick, asChild, ...props }: ActionProps) {
  const { setOpen } = useDialog();
  const Comp: any = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants(), className)}
      onClick={(event: any) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, onClick, asChild, ...props }: ActionProps) {
  const { setOpen } = useDialog();
  const Comp: any = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      onClick={(event: any) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
