import * as React from 'react';
import { Toggle } from '../components/ui/toggle';

export function ToggleView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Toggle</h1>
      <Toggle>Bold</Toggle>
    </div>
  );
}
