import * as React from 'react';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';

const TabsContext = React.createContext<{ value: string; setValue: (value: string) => void }>({
  value: '',
  setValue: () => {},
});

function Tabs({
  className,
  value,
  defaultValue = '',
  onValueChange,
  ...props
}: React.ComponentProps<'div'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn('flex flex-col gap-2', className)} {...props} />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex h-9 flex-row items-center self-start rounded-lg bg-muted p-[3]', className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value,
  ...props
}: Omit<React.ComponentProps<'button'>, 'value'> & { value: string }) {
  const tabs = React.useContext(TabsContext);
  const active = tabs.value === value;
  return (
    <button
      className={cn(
        'flex flex-1 flex-row items-center justify-center self-stretch rounded-md border border-transparent px-2 text-sm font-medium',
        active
          ? 'bg-background text-foreground dark:border-input dark:bg-input/30'
          : 'bg-transparent text-muted-foreground',
        className,
      )}
      onClick={() => tabs.setValue(value)}
      {...props}
    />
  );
}

function TabsContent({ className, value, ...props }: React.ComponentProps<'div'> & { value: string }) {
  const tabs = React.useContext(TabsContext);
  if (tabs.value !== value) return null;
  return <div className={cn('flex flex-col', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
