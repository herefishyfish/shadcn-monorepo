import * as React from 'react';
import { cn } from '../../lib/utils';

type AccordionContextValue = { isOpen: (value: string) => boolean; toggle: (value: string) => void };
const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const ItemContext = React.createContext('');

function Accordion({
  className,
  type = 'single',
  collapsible = true,
  defaultValue,
  ...props
}: Omit<React.ComponentProps<'div'>, 'defaultValue'> & {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
}) {
  const [open, setOpen] = React.useState<string[]>(
    defaultValue === undefined ? [] : ([] as string[]).concat(defaultValue),
  );
  const toggle = (value: string) =>
    setOpen((list) => {
      if (list.includes(value)) return collapsible || type === 'multiple' ? list.filter((v) => v !== value) : list;
      return type === 'multiple' ? [...list, value] : [value];
    });
  return (
    <AccordionContext.Provider value={{ isOpen: (value) => open.includes(value), toggle }}>
      <div className={cn('flex flex-col', className)} {...props} />
    </AccordionContext.Provider>
  );
}

function AccordionItem({ className, value, ...props }: React.ComponentProps<'div'> & { value: string }) {
  return (
    <ItemContext.Provider value={value}>
      <div className={cn('flex flex-col border-b border-border', className)} {...props} />
    </ItemContext.Provider>
  );
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<'div'>) {
  const accordion = React.useContext(AccordionContext)!;
  const value = React.useContext(ItemContext);
  const open = accordion.isOpen(value);
  return (
    <div
      className={cn('flex flex-row items-center justify-between gap-4 py-4', className)}
      onClick={() => accordion.toggle(value)}
      {...props}
    >
      <span className="flex-1 text-sm font-medium text-foreground">{children}</span>
      <span className="text-xs text-muted-foreground">{open ? '▴' : '▾'}</span>
    </div>
  );
}

function AccordionContent({ className, ...props }: React.ComponentProps<'div'>) {
  const accordion = React.useContext(AccordionContext)!;
  const value = React.useContext(ItemContext);
  if (!accordion.isOpen(value)) return null;
  return <div className={cn('flex flex-col pb-4 text-sm', className)} {...props} />;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
