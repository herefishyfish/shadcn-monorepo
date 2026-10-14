import * as React from 'react';
import { Spinner } from '../components/ui/spinner';

export function SpinnerView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Spinner</h1>
      <Spinner />
    </div>
  );
}
