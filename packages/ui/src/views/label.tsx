import * as React from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function LabelView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Label</h1>
      <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="m@example.com" />
    </div>
    </div>
  );
}
