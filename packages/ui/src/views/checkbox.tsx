import * as React from 'react';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

export function CheckboxView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Checkbox</h1>
      <div className="flex flex-row items-center gap-2">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">Accept terms</Label>
    </div>
    </div>
  );
}
