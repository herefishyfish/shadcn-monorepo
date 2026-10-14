import * as React from 'react';
import { Badge } from '../components/ui/badge';

export function BadgeView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Badge</h1>
      <div className="flex flex-row flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
    </div>
  );
}
