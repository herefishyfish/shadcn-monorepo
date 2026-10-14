import * as React from 'react';
import { Button } from '../components/ui/button';

export function ButtonView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Button</h1>
      <div className="flex flex-row flex-wrap gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
    </div>
    </div>
  );
}
