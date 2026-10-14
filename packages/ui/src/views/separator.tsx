import * as React from 'react';
import { Separator } from '../components/ui/separator';

export function SeparatorView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Separator</h1>
      <div className="flex flex-col gap-3">
      <span className="text-sm text-foreground">Above</span>
      <Separator />
      <span className="text-sm text-foreground">Below</span>
    </div>
    </div>
  );
}
