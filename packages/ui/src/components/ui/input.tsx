import * as React from 'react';
import { cn } from '../../lib/utils';
import { useLabelTarget } from './label';

/**
 * MasonKit's <input> fires `input` as you type, while the renderer maps
 * `onChange` to core's `textChange`, so `onChange` is wired to `input` here.
 * Read the text from `event.target.value`, as on the web. `value` and
 * `defaultValue` behave as on the web too.
 */
function Input({
  className,
  onChange,
  ref,
  ...props
}: Omit<React.ComponentProps<'input'>, 'onChange'> & {
  onChange?: (event: { target: { value: string } }) => void;
}) {
  const native = React.useRef<any>(null);
  useLabelTarget(props.id, () => native.current?.focus?.());
  return (
    <input
      ref={(view: any) => {
        native.current = view;
        if (typeof ref === 'function') ref(view);
        else if (ref) (ref as React.RefObject<any>).current = view;
      }}
      className={cn(
        'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base text-foreground placeholder:text-muted-foreground focus:border-ring dark:bg-input/30',
        className,
      )}
      onInput={onChange as any}
      {...props}
    />
  );
}

export { Input };
