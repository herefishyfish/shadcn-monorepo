import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { useControllable } from '@/hooks/use-controllable';
import { Portal } from '@/components/ui/overlay';
import { Popover, PopoverPanel, usePopover } from '@/components/ui/popover';

type SelectContextValue = {
  value: string;
  setValue: (value: string) => void;
  labels: React.RefObject<Map<string, React.ReactNode>>;
};
const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('Select parts must be inside <Select>.');
  return context;
}

function Select({
  value,
  defaultValue = '',
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}) {
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  // Item labels, so <SelectValue> can show the selected one's.
  const labels = React.useRef(new Map<string, React.ReactNode>());
  return (
    <SelectContext.Provider value={{ value: current, setValue, labels }}>
      <Popover>{children}</Popover>
    </SelectContext.Provider>
  );
}

function SelectTrigger({
  className,
  children,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'sm' | 'default' }) {
  const { open, setOpen, anchor } = usePopover();
  return (
    <div
      ref={anchor as never}
      className={cn(
        'flex flex-row items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 dark:bg-input/30',
        size === 'default' ? 'h-9' : 'h-8',
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <span className="text-xs text-muted-foreground">▾</span>
    </div>
  );
}

function SelectValue({ placeholder, className }: { placeholder?: string; className?: string }) {
  const { value, labels } = useSelect();
  const label = value ? (labels.current.get(value) ?? value) : null;
  return (
    <span
      className={cn('flex-1 text-sm', label ? 'text-foreground' : 'text-muted-foreground', className)}
    >
      {label ?? placeholder}
    </span>
  );
}

function SelectContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { open } = usePopover();
  if (!open) return null;
  return (
    <Portal>
      <PopoverPanel className={cn('max-h-72 p-1', className)} {...props} />
    </Portal>
  );
}

function SelectItem({
  className,
  value,
  children,
  disabled,
  ...props
}: React.ComponentProps<'div'> & { value: string; disabled?: boolean }) {
  const select = useSelect();
  const { setOpen } = usePopover();
  select.labels.current.set(value, children);
  const selected = select.value === value;
  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 hover:bg-accent active:bg-accent',
        disabled && 'opacity-50',
        className,
      )}
      onClick={() => {
        if (disabled) return;
        select.setValue(value);
        setOpen(false);
      }}
      {...props}
    >
      <span className="flex-1 text-sm text-popover-foreground">{children}</span>
      {selected && <span className="absolute right-2 text-sm text-popover-foreground">✓</span>}
    </div>
  );
}

function SelectGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />;
}

function SelectLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('px-2 py-1.5 text-xs text-muted-foreground', className)} {...props} />;
}

function SelectSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('-mx-1 my-1 h-[1] bg-border', className)} {...props} />;
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
};
