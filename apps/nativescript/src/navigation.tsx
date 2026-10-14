import { createContext, useContext, type ComponentType } from 'react';
import { Frame, type NavigatedData, type Page } from '@nativescript/core';
import { render } from '@nativescript-community/react';
import { document } from 'dominative';
import { OverlayProvider } from '@/components/ui/overlay';
import { Toaster } from '@/components/ui/sonner';

const PageContext = createContext<Page | null>(null);

/** The Page this screen was navigated to, or null on the home screen. */
export function usePage() {
  return useContext(PageContext);
}

/**
 * Shows `Screen` on a new Page, with its own overlay layer for dialogs and
 * toasts. Each Page is its own React root, and it
 * unmounts when you navigate back from it, so effects clean up (canvases stop
 * drawing, Workers end) just as they would on the web.
 */
export function navigate(Screen: ComponentType) {
  const page = document.createElement('page') as Page;
  page.actionBarHidden = true;
  const unmount = render(
    <PageContext.Provider value={page}>
      <OverlayProvider>
        <Screen />
        <Toaster />
      </OverlayProvider>
    </PageContext.Provider>,
    page,
  );
  page.on('navigatedFrom', (args: NavigatedData) => {
    if (args.isBackNavigation) {
      unmount();
    }
  });
  Frame.topmost().navigate({ create: () => page });
}

export function goBack() {
  Frame.topmost().goBack();
}
