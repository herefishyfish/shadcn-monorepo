import * as React from 'react';
import { Kbd } from '../components/ui/kbd';

export function KbdView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Kbd</h1>
      <div className="flex flex-row items-center gap-1">
      <Kbd>⌘</Kbd><Kbd>K</Kbd>
    </div>
    </div>
  );
}
