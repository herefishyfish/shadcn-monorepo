import * as React from 'react';


export function CommandView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Command</h1>
      <div className="flex max-w-sm flex-col rounded-lg border border-border">
      <div className="border-b border-border px-3 py-2"><span className="text-sm text-muted-foreground">Search…</span></div>
      <div className="flex flex-col p-1">
        <span className="rounded-md px-2 py-1.5 text-sm text-foreground">Calendar</span>
        <span className="rounded-md px-2 py-1.5 text-sm text-foreground">Settings</span>
        <span className="rounded-md px-2 py-1.5 text-sm text-muted-foreground">No other matches</span>
      </div>
    </div>
    </div>
  );
}
