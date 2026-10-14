import * as React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';

export function ToggleGroupView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Toggle group</h1>
      <ToggleGroup type="single" variant="outline" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
    </div>
  );
}
