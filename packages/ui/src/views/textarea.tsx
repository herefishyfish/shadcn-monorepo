import * as React from 'react';
import { Textarea } from '../components/ui/textarea';

export function TextareaView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Textarea</h1>
      <Textarea placeholder="Write something…" />
    </div>
  );
}
