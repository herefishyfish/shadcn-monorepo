import * as React from 'react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';
import { useControllable } from '../../hooks/use-controllable';

// Spelled out: toLocaleString throws on NativeScript for Windows.
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const sameDay = (a?: Date, b?: Date) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** A single-date month calendar, with react-day-picker's `selected` / `onSelect`. */
function Calendar({
  className,
  selected,
  onSelect,
  defaultMonth,
  disabled,
  showOutsideDays = true,
}: {
  className?: string;
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultMonth?: Date;
  disabled?: (date: Date) => boolean;
  showOutsideDays?: boolean;
}) {
  const [month, setMonth] = React.useState(() => {
    const d = defaultMonth ?? selected ?? new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [value, setValue] = useControllable<Date | undefined>(selected, undefined, onSelect as any);
  const today = new Date();
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
  // Only the weeks this month spans (4 to 6), as react-day-picker draws them.
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((month.getDay() + daysInMonth) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const shift = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));

  return (
    <div className={cn('flex flex-col gap-2 p-3', className)}>
      <div className="flex flex-row items-center justify-between">
        <button className={buttonVariants({ variant: 'ghost', size: 'icon' })} onClick={() => shift(-1)}>
          ‹
        </button>
        <span className="text-sm font-medium text-foreground">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <button className={buttonVariants({ variant: 'ghost', size: 'icon' })} onClick={() => shift(1)}>
          ›
        </button>
      </div>
      <div className="flex flex-row">
        {WEEKDAYS.map((day) => (
          <span key={day} className="w-9 text-center text-xs text-muted-foreground">
            {day}
          </span>
        ))}
      </div>
      {Array.from({ length: weeks }, (_, week) => (
        <div key={week} className="flex flex-row">
          {days.slice(week * 7, week * 7 + 7).map((day) => {
            const outside = day.getMonth() !== month.getMonth();
            if (outside && !showOutsideDays) return <div key={day.getTime()} className="size-9" />;
            const isSelected = sameDay(day, value);
            const isDisabled = disabled?.(day);
            return (
              <button
                key={day.getTime()}
                className={cn(
                  'size-9 rounded-md text-center text-sm',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : sameDay(day, today)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-transparent text-foreground active:bg-accent',
                  outside && !isSelected && 'text-muted-foreground opacity-50',
                  isDisabled && 'opacity-30',
                )}
                disabled={isDisabled}
                isEnabled={!isDisabled}
                onClick={() => !isDisabled && setValue(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { Calendar };
