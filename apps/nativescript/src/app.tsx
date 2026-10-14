// The DOM React renders into, and MasonKit's elements. Must load first.
import './dom';
import { Application } from '@nativescript/core';
import { startReactApp } from '@nativescript-community/react';
import { OverlayProvider } from '@/components/ui/overlay';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from './components/AppShell';

function App() {
  return (
    <OverlayProvider>
      <AppShell />
      <Toaster />
    </OverlayProvider>
  );
}

startReactApp({ Application, root: App });
