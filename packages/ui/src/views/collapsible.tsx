import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

export function CollapsibleView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Collapsible</h1>
      <Collapsible defaultOpen className="max-w-sm rounded-lg border border-border p-3">
      <CollapsibleTrigger className="text-sm font-medium text-foreground">Order details</CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <span className="text-sm text-muted-foreground">2 items · ships tomorrow</span>
      </CollapsibleContent>
    </Collapsible>
    </div>
  );
}
