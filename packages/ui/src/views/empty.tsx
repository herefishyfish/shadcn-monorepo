import * as React from 'react';
import { Button } from '../components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../components/ui/empty';

export function EmptyView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Empty</h1>
      <Empty>
      <EmptyHeader>
        <EmptyMedia><span className="text-sm">∅</span></EmptyMedia>
        <EmptyTitle>No projects</EmptyTitle>
        <EmptyDescription>Create one to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button>New project</Button></EmptyContent>
    </Empty>
    </div>
  );
}
