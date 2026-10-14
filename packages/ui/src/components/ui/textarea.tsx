import * as React from 'react';
import { cn } from '../../lib/utils';
import { useLabelTarget } from './label';

/**
 * MasonKit's <textarea> fires `input` as you type, while the renderer maps
 * `onChange` to core's `textChange`, so `onChange` is wired to `input` here.
 * Read the text from `event.target.value`, as on the web. `value` and
 * `defaultValue` behave as on the web too.
 */
function Textarea({
  className,
  onChange,
  ref,
  ...props
}: Omit<React.ComponentProps<'textarea'>, 'onChange'> & {
  onChange?: (event: { target: { value: string } }) => void;
}) {
  const native = React.useRef<any>(null);
  useLabelTarget(props.id, () => native.current?.focus?.());
  return (
    <textarea
      ref={(view: any) => {
        native.current = view;
        if (typeof ref === 'function') ref(view);
        else if (ref) (ref as React.RefObject<any>).current = view;
      }}
      className={cn(
        'min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-ring dark:bg-input/30',
        className,
      )}
      onInput={onChange as any}
      {...props}
    />
  );
}

export { Textarea };
