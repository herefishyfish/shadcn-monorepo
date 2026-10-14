import { useState } from 'react';
import { catalog } from '@repo/ui/catalog';
import { pages } from './pages';
import { ThemeProvider, useWebTheme } from './theme';

function Shell() {
  const [page, setPage] = useState('kite');
  const { appearance, toggle } = useWebTheme();
  const current = catalog.find((item) => item.id === page);
  const Page = pages[page as keyof typeof pages];
  const title = current?.title ?? 'Kite Station';

  return (
    <div className="flex h-full flex-row bg-background text-foreground">
      <aside className="flex w-56 shrink-0 flex-col overflow-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex flex-row items-center gap-2 px-4 py-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Acme Inc</span>
            <span className="text-xs text-sidebar-foreground/70">Web</span>
          </div>
        </div>
        {(['App', 'Components'] as const).map((group) => (
          <div key={group} className="flex flex-col gap-0.5 px-2 pb-3">
            <span className="px-2 py-1 text-xs text-sidebar-foreground/70">{group}</span>
            {catalog
              .filter((item) => item.group === group)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPage(item.id)}
                  className={
                    item.id === page
                      ? 'rounded-md bg-sidebar-accent px-2 py-1.5 text-left text-sm text-sidebar-accent-foreground'
                      : 'rounded-md px-2 py-1.5 text-left text-sm hover:bg-sidebar-accent'
                  }
                >
                  {item.title}
                </button>
              ))}
          </div>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-row items-center gap-2 border-b border-border px-4 py-3">
          <span className="flex-1 text-base font-medium">{title}</span>
          <button
            type="button"
            onClick={toggle}
            className="rounded-md border border-border px-3 py-1 text-sm"
          >
            {appearance === 'dark' ? 'Light' : 'Dark'}
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
            {Page ? <Page /> : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
