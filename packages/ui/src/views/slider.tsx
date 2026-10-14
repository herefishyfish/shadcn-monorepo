import * as React from 'react';
import { Slider } from '../components/ui/slider';

export function SliderView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Slider</h1>
      <Slider defaultValue={[40]} />
    </div>
  );
}
