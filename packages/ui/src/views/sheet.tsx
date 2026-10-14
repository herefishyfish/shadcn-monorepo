import * as React from 'react';
import { Button } from '../components/ui/button';

export function SheetView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Sheet</h1>
      <div className="flex max-w-sm flex-col gap-3 rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Edit</h2>
      <p className="text-sm text-muted-foreground">Make changes, then save.</p>
      <Button>Save</Button>
    </div>
    </div>
  );
}
