import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function TabsView() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Tabs</h1>
      <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account"><span className="text-sm text-muted-foreground">Account settings</span></TabsContent>
      <TabsContent value="password"><span className="text-sm text-muted-foreground">Change your password</span></TabsContent>
    </Tabs>
    </div>
  );
}
