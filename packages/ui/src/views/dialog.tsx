import * as React from 'react';
import { Button } from '../components/ui/button';

export function DialogView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Dialog</h1>
      <div className="flex max-w-md flex-col gap-3 rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Edit profile</h2>
      <p className="text-sm text-muted-foreground">Update the name people see.</p>
      <div className="flex flex-row justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
    </div>
  );
}
