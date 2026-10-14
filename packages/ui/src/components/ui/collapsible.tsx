import * as React from 'react';
import { cn } from '../../lib/utils';
import { Slot } from '../../lib/slot';
import { useControllable } from '../../hooks/use-controllable';

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function Collapsible({
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<'div'> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <CollapsibleContext.Provider value={{ open: isOpen, setOpen }}>
      <div className={cn('flex flex-col', className)} {...props} />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ asChild, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const { open, setOpen } = React.useContext(CollapsibleContext)!;
  const Comp: any = asChild ? Slot : 'div';
  return <Comp {...props} onClick={() => setOpen(!open)} />;
}

function CollapsibleContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open } = React.useContext(CollapsibleContext)!;
  if (!open) return null;
  return <div className={cn('flex flex-col', className)} {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
