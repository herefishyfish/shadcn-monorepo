import * as React from 'react';
import { Button } from '../components/ui/button';

export function DrawerView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Drawer</h1>
      <div className="flex max-w-md flex-col gap-3 rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Move goal</h2>
      <p className="text-sm text-muted-foreground">Set your daily target.</p>
      <Button>Submit</Button>
    </div>
    </div>
  );
}
