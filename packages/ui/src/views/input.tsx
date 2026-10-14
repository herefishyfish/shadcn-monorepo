import * as React from 'react';
import { Input } from '../components/ui/input';

export function InputView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Input</h1>
      <Input placeholder="Email" />
    </div>
  );
}
