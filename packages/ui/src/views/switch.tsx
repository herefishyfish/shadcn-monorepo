import * as React from 'react';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export function SwitchView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Switch</h1>
      <div className="flex flex-row items-center gap-2">
      <Switch id="wifi" defaultChecked />
      <Label htmlFor="wifi">Wi-Fi</Label>
    </div>
    </div>
  );
}
