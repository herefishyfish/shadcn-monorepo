import * as React from 'react';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';
import { useLabelTarget } from './label';

function Checkbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange);
  const toggle = () => !disabled && setOn(!on);
  useLabelTarget(id, toggle);
  // The box is 16dp; the padding around it widens the target. Pair it with a
  // Label htmlFor for a bigger one.
  return (
    <div className="flex p-1" onClick={toggle}>
      <div
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-[4] border',
          on ? 'border-primary bg-primary' : 'border-input dark:bg-input/30',
          disabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {on && <span className="text-[10] font-bold text-primary-foreground">✓</span>}
      </div>
    </div>
  );
}

export { Checkbox };
