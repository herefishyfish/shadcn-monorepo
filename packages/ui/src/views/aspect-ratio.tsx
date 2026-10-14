import * as React from 'react';
import { AspectRatio } from '../components/ui/aspect-ratio';

export function AspectRatioView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Aspect ratio</h1>
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
      <div className="flex size-full items-center justify-center">
        <span className="text-sm text-muted-foreground">16:9</span>
      </div>
    </AspectRatio>
    </div>
  );
}
