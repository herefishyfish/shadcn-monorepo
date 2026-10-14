import * as React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export function CardView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Card</h1>
      <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>Shared card markup.</CardDescription>
      </CardHeader>
      <CardContent><span className="text-sm text-muted-foreground">One file, every platform.</span></CardContent>
      <CardFooter><Button>Continue</Button></CardFooter>
    </Card>
    </div>
  );
}
