import * as React from 'react';
import { ScrollArea } from '../components/ui/scroll-area';

export function ScrollAreaView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Scroll area</h1>
      <ScrollArea className="h-24 rounded-md border border-border p-3">
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }, (_, i) => <span key={i} className="text-sm text-foreground">Row {i + 1}</span>)}
      </div>
    </ScrollArea>
    </div>
  );
}
