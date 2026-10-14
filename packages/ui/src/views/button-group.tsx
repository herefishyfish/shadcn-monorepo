import * as React from 'react';
import { Button } from '../components/ui/button';
import { ButtonGroup } from '../components/ui/button-group';

export function ButtonGroupView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Button group</h1>
      <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
    </div>
  );
}
