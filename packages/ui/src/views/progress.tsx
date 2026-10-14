import * as React from 'react';
import { Progress } from '../components/ui/progress';

export function ProgressView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Progress</h1>
      <Progress value={62} />
    </div>
  );
}
