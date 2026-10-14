import * as React from 'react';


export function SonnerView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Sonner</h1>
      <div className="max-w-sm rounded-lg border border-border bg-popover p-4">
      <span className="text-sm font-medium text-popover-foreground">Saved</span>
      <p className="text-sm text-muted-foreground">Your profile was updated.</p>
    </div>
    </div>
  );
}
