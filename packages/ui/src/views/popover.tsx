import * as React from 'react';


export function PopoverView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Popover</h1>
      <div className="max-w-xs rounded-lg border border-border bg-popover p-3">
      <span className="text-sm text-popover-foreground">Dimensions in pixels.</span>
    </div>
    </div>
  );
}
