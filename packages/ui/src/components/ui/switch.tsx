import * as React from 'react';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';
import { useLabelTarget } from './label';

function Switch({
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
  useLabelTarget(id, () => !disabled && setOn(!on));
  return (
    <div
      className={cn(
        'flex h-[18] w-8 shrink-0 flex-row items-center rounded-full px-[1]',
        on ? 'justify-end bg-primary' : 'justify-start bg-input dark:bg-input/80',
        disabled && 'opacity-50',
        className,
      )}
      onClick={() => !disabled && setOn(!on)}
      {...props}
    >
      <div
        className={cn(
          'size-4 rounded-full',
          on ? 'bg-background dark:bg-primary-foreground' : 'bg-background dark:bg-foreground',
        )}
      />
    </div>
  );
}

export { Switch };
