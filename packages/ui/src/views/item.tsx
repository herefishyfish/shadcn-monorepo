import * as React from 'react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../components/ui/item';

export function ItemView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Item</h1>
      <Item>
      <ItemMedia><Avatar><AvatarFallback>AL</AvatarFallback></Avatar></ItemMedia>
      <ItemContent>
        <ItemTitle>Ada Lovelace</ItemTitle>
        <ItemDescription>ada@example.com</ItemDescription>
      </ItemContent>
    </Item>
    </div>
  );
}
