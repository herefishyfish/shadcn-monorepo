import * as React from 'react';
import { cn } from '../../lib/utils';

const OTPContext = React.createContext<{ value: string; maxLength: number }>({ value: '', maxLength: 6 });

/**
 * One transparent <input> laid over the slots takes the typing; the slots
 * show its characters. `value` / `onChange(value)` as in shadcn.
 */
function InputOTP({
  className,
  maxLength = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  children,
}: {
  className?: string;
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  children?: React.ReactNode;
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  const update = (event: any) => {
    const next = String(event.target.value ?? '').slice(0, maxLength);
    if (value === undefined) setInner(next);
    onChange?.(next);
    if (next.length === maxLength) onComplete?.(next);
  };
  return (
    <OTPContext.Provider value={{ value: current, maxLength }}>
      <div className={cn('relative flex flex-row items-center gap-2 self-start', className)}>
        {children}
        <input className="absolute inset-0 opacity-0" value={current} onInput={update} />
      </div>
    </OTPContext.Provider>
  );
}

const SlotPosition = React.createContext<{ first: number; last: number }>({ first: 0, last: 0 });

/** Joins its slots into one box: round outer corners, shared inner borders. */
function InputOTPGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
  const indexes = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child: any) => child.props.index as number);
  return (
    <SlotPosition.Provider value={{ first: Math.min(...indexes), last: Math.max(...indexes) }}>
      <div className={cn('flex flex-row items-center', className)} {...props}>
        {children}
      </div>
    </SlotPosition.Provider>
  );
}

function InputOTPSlot({ className, index, ...props }: React.ComponentProps<'div'> & { index: number }) {
  const { value, maxLength } = React.useContext(OTPContext);
  const group = React.useContext(SlotPosition);
  const char = value[index];
  const active = index === Math.min(value.length, maxLength - 1);
  return (
    <div
      className={cn(
        // Not border-y: it compiles to logical properties NativeScript drops.
        'flex size-9 items-center justify-center border border-input dark:bg-input/30',
        index === group.first ? 'rounded-l-md' : 'border-l-0',
        index === group.last && 'rounded-r-md',
        active && 'border-ring',
        className,
      )}
      {...props}
    >
      <span className="text-sm text-foreground">{char ?? ''}</span>
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span role="separator" className={cn('text-sm text-muted-foreground', className)} {...props}>
      –
    </span>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
