import * as React from 'react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export function AvatarView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Avatar</h1>
      <div className="flex flex-row gap-3">
      <Avatar><AvatarFallback>NS</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>WB</AvatarFallback></Avatar>
    </div>
    </div>
  );
}
