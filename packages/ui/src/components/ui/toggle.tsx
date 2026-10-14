import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';

const toggleVariants = cva(
  'flex flex-row items-center justify-center gap-2 rounded-md text-center text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent',
      },
      size: {
        default: 'h-9 min-w-9 px-2',
        sm: 'h-8 min-w-8 px-1.5',
        lg: 'h-10 min-w-10 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onClick'> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }) {
  const [on, setOn] = useControllable(pressed, defaultPressed, onPressedChange);
  return (
    <button
      className={cn(
        toggleVariants({ variant, size }),
        on ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
        disabled && 'opacity-50',
        className,
      )}
      disabled={disabled}
      isEnabled={!disabled}
      onClick={() => !disabled && setOn(!on)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
