import * as React from 'react';


export function SelectView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Select</h1>
      <div className="flex h-9 w-48 items-center rounded-md border border-input px-3">
      <span className="flex-1 text-sm text-foreground">Apple</span>
      <span className="text-sm text-muted-foreground">▾</span>
    </div>
    </div>
  );
}
