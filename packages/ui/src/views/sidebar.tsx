import * as React from 'react';


export function SidebarView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Sidebar</h1>
      <div className="flex h-48 flex-row overflow-hidden rounded-lg border border-sidebar-border">
      <div className="flex w-40 flex-col gap-1 bg-sidebar p-2">
        <span className="px-2 py-1 text-sm font-medium text-sidebar-foreground">Acme</span>
        <span className="rounded-md bg-sidebar-accent px-2 py-1 text-sm text-sidebar-accent-foreground">Dashboard</span>
        <span className="rounded-md px-2 py-1 text-sm text-sidebar-foreground">Settings</span>
      </div>
      <div className="flex flex-1 items-center p-4"><span className="text-sm text-muted-foreground">Content</span></div>
    </div>
    </div>
  );
}
