import * as React from 'react';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';
import { useLabelTarget } from './label';

const RadioGroupContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
} | null>(null);

function RadioGroup({
  className,
  value,
  defaultValue = '',
  onValueChange,
  ...props
}: Omit<React.ComponentProps<'div'>, 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  return (
    <RadioGroupContext.Provider value={{ value: current, setValue }}>
      <div role="radiogroup" className={cn('flex flex-col gap-3', className)} {...props} />
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  className,
  value,
  disabled,
  id,
  ...props
}: React.ComponentProps<'div'> & { value: string; disabled?: boolean }) {
  const group = React.useContext(RadioGroupContext)!;
  const on = group.value === value;
  const select = () => !disabled && group.setValue(value);
  useLabelTarget(id, select);
  // The circle is 16dp; the padding around it widens the target. Pair it with
  // a Label htmlFor for a bigger one.
  return (
    <div className="flex p-1" onClick={select}>
      <div
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border',
          on ? 'border-primary' : 'border-input dark:bg-input/30',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {on && <div className="size-2 rounded-full bg-primary" />}
      </div>
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
