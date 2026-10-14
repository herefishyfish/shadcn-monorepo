import * as React from 'react';


export function TooltipView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Tooltip</h1>
      <div className="rounded-md bg-primary px-3 py-1.5">
      <span className="text-xs text-primary-foreground">Add to library</span>
    </div>
    </div>
  );
}
