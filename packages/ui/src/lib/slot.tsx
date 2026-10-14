import * as React from 'react';
import { cn } from './utils';

/**
 * Radix's `Slot`, for `asChild`: merges its props into its only child instead
 * of rendering an element of its own. Class names are joined and `onClick`
 * handlers both run.
 */
export function Slot({ children, ...props }: { children?: React.ReactNode; [prop: string]: any }) {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<any>;
  return React.cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(props.className, child.props.className),
    onClick: (event: unknown) => {
      child.props.onClick?.(event);
      props.onClick?.(event);
    },
  });
}
