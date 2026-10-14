import * as React from 'react';
import { cn } from '../../lib/utils';

/*
 * `htmlFor` works as on the web: tapping the label activates the control with
 * that `id` (toggles a Checkbox or Switch, picks a RadioGroupItem, focuses an
 * Input). NativeScript has no label association, so controls register here.
 */
const targets = new Map<string, () => void>();

/** Lets a Label with `htmlFor={id}` activate this control. */
function useLabelTarget(id: string | undefined, activate: () => void) {
  const latest = React.useRef(activate);
  latest.current = activate;
  React.useEffect(() => {
    if (!id) return;
    const run = () => latest.current();
    targets.set(id, run);
    return () => {
      if (targets.get(id) === run) targets.delete(id);
    };
  }, [id]);
}

function Label({ className, htmlFor, onClick, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn('text-sm font-medium text-foreground', className)}
      onClick={(event: any) => {
        onClick?.(event);
        if (htmlFor) targets.get(htmlFor)?.();
      }}
      {...props}
    />
  );
}

export { Label, useLabelTarget };
