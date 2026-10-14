import * as React from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../components/ui/input-group';

export function InputGroupView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Input group</h1>
      <InputGroup>
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
    </div>
  );
}
