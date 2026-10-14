import * as React from 'react';


export function ContextMenuView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Context menu</h1>
      <div className="flex max-w-xs flex-col rounded-lg border border-border bg-popover p-1">
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Back</span>
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Forward</span>
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Reload</span>
    </div>
    </div>
  );
}
