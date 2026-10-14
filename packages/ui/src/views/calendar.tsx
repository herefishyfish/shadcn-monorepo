import * as React from 'react';
import { Calendar } from '../components/ui/calendar';

export function CalendarView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
      <Calendar />
    </div>
  );
}
