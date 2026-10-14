import * as React from 'react';

/** Radix-style controlled/uncontrolled state: `value` wins when it's set. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}
