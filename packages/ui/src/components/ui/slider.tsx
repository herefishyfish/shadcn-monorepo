import * as React from 'react';
import { cn } from '../../lib/utils';
import { useControllable } from '../../hooks/use-controllable';

/**
 * One thumb, with shadcn's array value (`value={[50]}`). Drag or tap the track.
 */
function Slider({
  className,
  value,
  defaultValue = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  ...props
}: Omit<React.ComponentProps<'div'>, 'defaultValue'> & {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const [current, setValue] = useControllable(value, defaultValue, onValueChange);
  const track = React.useRef<any>(null);
  const percent = ((current[0] - min) / (max - min)) * 100;

  const update = (event: any) => {
    const node = track.current;
    const width = node?.getActualSize?.().width ?? node?.clientWidth;
    if (disabled || !width) return;
    const x = typeof event.getX === 'function' ? event.getX() : event.clientX - node.getBoundingClientRect().left;
    const ratio = Math.min(1, Math.max(0, x / width));
    const next = Math.round((min + ratio * (max - min)) / step) * step;
    if (next !== current[0]) setValue([next]);
  };

  return (
    <div
      ref={track as never}
      // touch-none keeps the drag from the scroll view around it, as on the web.
      className={cn('relative flex h-5 w-full touch-none flex-row items-center', disabled && 'opacity-50', className)}
      onTouch={(event: any) => event.action !== 'up' && event.action !== 'cancel' && update(event)}
      onPointerDown={(event: any) => event.action === undefined && update(event)}
      onPointerMove={(event: any) => event.action === undefined && event.buttons === 1 && update(event)}
      {...props}
    >
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <div
        className="absolute size-4 rounded-full border border-primary bg-background"
        style={{ left: `${percent}%`, marginLeft: -8 }}
      />
    </div>
  );
}

export { Slider };
