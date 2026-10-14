import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export function AlertView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Alert</h1>
      <div className="flex flex-col gap-3">
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can change this copy in one file.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Check the form and try again.</AlertDescription>
      </Alert>
    </div>
    </div>
  );
}
