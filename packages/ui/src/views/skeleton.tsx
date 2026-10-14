import * as React from 'react';
import { Skeleton } from '../components/ui/skeleton';

export function SkeletonView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Skeleton</h1>
      <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-64" />
    </div>
    </div>
  );
}
