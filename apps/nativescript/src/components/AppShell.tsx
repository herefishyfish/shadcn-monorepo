import * as React from 'react';
import { useState, type ComponentType } from 'react';
import { render } from '@nativescript-community/react';
import { document } from 'dominative';
import { catalog } from '@repo/ui/catalog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { OverlayProvider } from '@/components/ui/overlay';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/lib/theme';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { KitePage } from '@/pages/KitePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { library } from '@/pages/library';

const pages: Record<string, { title: string; icon: string; Page: ComponentType }> = {
  kite: { title: 'Kite Station', icon: '❄', Page: KitePage },
  dashboard: { title: 'Dashboard', icon: '▤', Page: DashboardPage },
  gallery: { title: 'Gallery', icon: '◆', Page: ComponentsPage },
  settings: { title: 'Settings', icon: '⚙', Page: SettingsPage },
  login: { title: 'Login', icon: '↩', Page: LoginPage },
};

for (const item of catalog) {
  if (item.group !== 'Components') continue;
  pages[item.id] = { title: item.title, icon: '·', Page: library[item.id] };
}

/**
 * Shows a page's render error in place of the page. Without it, an error in
 * any component unmounts the whole app.
 */
class PageErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Alert variant="destructive">
        <AlertTitle>This page failed to render</AlertTitle>
        <AlertDescription>{String(this.state.error.message ?? this.state.error)}</AlertDescription>
      </Alert>
    );
  }
}

/** The app's frame: a sidebar to switch pages, and a header over the page. */
export function AppShell() {
  const [page, setPage] = useState('kite');
  const { appearance, toggle } = useTheme();
  const { title, Page } = pages[page] ?? pages.dashboard;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex flex-row items-center gap-2 px-2 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Acme Inc</span>
              <span className="text-xs text-sidebar-foreground/70">Enterprise</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>App</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(['kite', 'dashboard', 'gallery', 'settings'] as const).map((key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton isActive={key === page} onClick={() => setPage(key)}>
                      <span className="w-4 text-center text-sm text-sidebar-foreground">{pages[key].icon}</span>
                      {pages[key].title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Components</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {catalog
                  .filter((item) => item.group === 'Components')
                  .map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton isActive={item.id === page} onClick={() => setPage(item.id)}>
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setPage('login')}>
                <span className="w-4 text-center text-sm text-sidebar-foreground">↩</span>
                Sign out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex flex-row items-center gap-2 border-b border-border px-4 py-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-4 self-center" />
          <span className="flex-1 text-base font-medium text-foreground">{title}</span>
          <Button variant="outline" size="sm" onClick={toggle}>
            {appearance === 'dark' ? '☀ Light' : '☾ Dark'}
          </Button>
        </header>
        {/* Keyed by page, so each page opens at the top. */}
        <scroll key={page} className="min-h-0 flex-1">
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
            <PageErrorBoundary key={page}>
              <Page />
            </PageErrorBoundary>
          </main>
        </scroll>
      </SidebarInset>
    </SidebarProvider>
  );
}

// First evaluation boots through Application.run. A later one is an HMR
// reload of this shell, which captured the new page components, so remount.
const hot = import.meta.hot as { data: { booted?: boolean } } | undefined;
if (hot?.data.booted) {
  const host = globalThis as typeof globalThis & { __NS_REACT_DISPOSE__?: () => void };
  try {
    host.__NS_REACT_DISPOSE__?.();
  } catch (err) {
    console.log('[ns-react] dispose error', err);
  }
  const body = document.body;
  while (body?.firstChild) body.removeChild(body.firstChild);
  host.__NS_REACT_DISPOSE__ = render(
    () => (
      <OverlayProvider>
        <AppShell />
        <Toaster />
      </OverlayProvider>
    ),
    body,
  );
}
if (hot) hot.data.booted = true;
