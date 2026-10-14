import * as React from 'react';


export function DropdownMenuView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Dropdown menu</h1>
      <div className="flex max-w-xs flex-col rounded-lg border border-border bg-popover p-1">
      <span className="px-2 py-1 text-xs text-muted-foreground">Account</span>
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Profile</span>
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Billing</span>
      <span className="rounded-md px-2 py-1.5 text-sm text-popover-foreground">Sign out</span>
    </div>
    </div>
  );
}
