import * as React from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

/*
 * Filters its items by the text typed into <CommandInput>. Items and groups
 * report whether they match, so <CommandEmpty> and empty groups can hide.
 */

type Counter = { report: (id: string, matches: boolean) => () => void; visible: number };

function useCounter(): Counter {
  const matches = React.useRef(new Map<string, boolean>());
  const [visible, setVisible] = React.useState(0);
  const recount = () => {
    let n = 0;
    matches.current.forEach((m) => m && n++);
    setVisible(n);
  };
  const report = React.useCallback((id: string, match: boolean) => {
    matches.current.set(id, match);
    recount();
    return () => {
      matches.current.delete(id);
      recount();
    };
  }, []);
  return { report, visible };
}

const CommandContext = React.createContext<{
  query: string;
  setQuery: (q: string) => void;
  root: Counter;
  autoFocus: boolean;
} | null>(null);
const GroupContext = React.createContext<Counter | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error('Command parts must be inside <Command>.');
  return context;
}

/** `autoFocus` focuses <CommandInput> when it appears, as CommandDialog does. */
function Command({ className, autoFocus = false, ...props }: React.ComponentProps<'div'> & { autoFocus?: boolean }) {
  const [query, setQuery] = React.useState('');
  const root = useCounter();
  return (
    <CommandContext.Provider value={{ query, setQuery, root, autoFocus }}>
      <div
        className={cn('flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)}
        {...props}
      />
    </CommandContext.Provider>
  );
}

function CommandInput({ className, placeholder }: { className?: string; placeholder?: string }) {
  const { query, setQuery, autoFocus } = useCommand();
  const input = React.useRef<any>(null);
  React.useEffect(() => {
    if (!autoFocus) return;
    // After the dialog's enter animation has started and the view is laid out.
    const timer = setTimeout(() => input.current?.focus?.(), 150);
    return () => clearTimeout(timer);
  }, [autoFocus]);
  return (
    <div className="flex h-9 flex-row items-center gap-2 border-b border-border px-3">
      <span className="text-sm text-muted-foreground">⌕</span>
      <Input
        ref={input}
        className={cn('h-full flex-1 rounded-none border-0 bg-transparent px-0 dark:bg-transparent', className)}
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex max-h-72 flex-col overflow-hidden p-1', className)} {...props} />;
}

function CommandEmpty({ className, ...props }: React.ComponentProps<'p'>) {
  const { root } = useCommand();
  if (root.visible > 0) return null;
  return <p className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props} />;
}

function CommandGroup({
  className,
  heading,
  children,
  ...props
}: React.ComponentProps<'div'> & { heading?: React.ReactNode }) {
  const group = useCounter();
  return (
    <GroupContext.Provider value={group}>
      <div className={cn('flex flex-col', group.visible === 0 && 'hidden', className)} {...props}>
        {heading && <span className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</span>}
        {children}
      </div>
    </GroupContext.Provider>
  );
}

let nextId = 0;

function CommandItem({
  className,
  value,
  keywords = [],
  disabled,
  onSelect,
  children,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSelect'> & {
  value?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}) {
  const { query, root } = useCommand();
  const group = React.useContext(GroupContext);
  const id = React.useMemo(() => String(nextId++), []);
  const text = value ?? React.Children.toArray(children).filter((c) => typeof c === 'string').join(' ');
  const q = query.trim().toLowerCase();
  const matches = !q || [text, ...keywords].some((t) => t.toLowerCase().includes(q));

  React.useLayoutEffect(() => root.report(id, matches), [matches]);
  React.useLayoutEffect(() => group?.report(id, matches), [matches]);
  if (!matches) return null;

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent active:bg-accent',
        disabled && 'opacity-50',
        className,
      )}
      onClick={() => !disabled && onSelect?.(text)}
      {...props}
    >
      {React.Children.map(children, (child) =>
        typeof child === 'string' ? <span className="flex-1 text-sm text-popover-foreground">{child}</span> : child,
      )}
    </div>
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('-mx-1 my-1 h-[1] bg-border', className)} {...props} />;
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-xs text-muted-foreground', className)} {...props} />;
}

function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0" showCloseButton={false}>
        <Command autoFocus>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
