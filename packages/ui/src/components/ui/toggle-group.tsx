import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { toggleVariants } from './toggle';

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  isOn: (value: string) => boolean;
  toggle: (value: string) => void;
};
const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

type SingleProps = {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
type MultipleProps = {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...rest
}: Omit<React.ComponentProps<'div'>, 'defaultValue'> &
  VariantProps<typeof toggleVariants> &
  (SingleProps | MultipleProps)) {
  const { type, value, defaultValue, onValueChange, ...props } = rest as any;
  const [inner, setInner] = React.useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : ''),
  );
  const current = value !== undefined ? value : inner;
  const set = (next: string | string[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const isOn = (item: string) =>
    type === 'multiple' ? (current as string[]).includes(item) : current === item;
  const toggle = (item: string) => {
    if (type === 'multiple') {
      const list = current as string[];
      set(list.includes(item) ? list.filter((v) => v !== item) : [...list, item]);
    } else {
      set(current === item ? '' : item);
    }
  };
  return (
    <ToggleGroupContext.Provider value={{ variant, size, isOn, toggle }}>
      <div
        className={cn(
          'flex flex-row items-center self-start rounded-md',
          variant === 'outline' && 'border border-input',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  className,
  value,
  ...props
}: Omit<React.ComponentProps<'button'>, 'value'> & { value: string }) {
  const group = React.useContext(ToggleGroupContext)!;
  const on = group.isOn(value);
  return (
    <button
      className={cn(
        toggleVariants({ variant: 'default', size: group.size }),
        'shrink-0 rounded-none px-3',
        on ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
        className,
      )}
      onClick={() => group.toggle(value)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
