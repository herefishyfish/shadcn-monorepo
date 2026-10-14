import * as React from 'react';
import { Screen } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

/*
 * shadcn's Sidebar: a fixed column on wide windows, a slide-out sheet below
 * MOBILE_BREAKPOINT. There are no media queries, so SidebarProvider measures
 * its own width, and re-measures when the window is resized.
 */
const MOBILE_BREAKPOINT = 768;

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>.');
  return context;
}

function SidebarProvider({
  className,
  defaultOpen = true,
  children,
  ...props
}: React.ComponentProps<'div'> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  // Start from the screen's width (the first layoutChanged can fire before
  // React listens), then follow the provider's own width as the window resizes.
  const [width, setWidth] = React.useState(() => Screen.mainScreen.widthDIPs);
  const isMobile = width < MOBILE_BREAKPOINT;
  const toggleSidebar = () => (isMobile ? setOpenMobile(!openMobile) : setOpen(!open));
  return (
    <SidebarContext.Provider value={{ open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }}>
      <div
        className={cn('flex size-full flex-row', className)}
        onLayoutChanged={(event: any) => {
          const next = event.object.getActualSize().width;
          if (next > 0) setWidth(next);
        }}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { isMobile, open, openMobile, setOpenMobile } = useSidebar();
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0">
          {children}
        </SheetContent>
      </Sheet>
    );
  }
  if (!open) return null;
  return (
    <div
      className={cn(
        'flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-8', className)}
      onClick={(event: any) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      ☰
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex min-w-0 flex-1 flex-col bg-background', className)} {...props} />;
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <scroll className={cn('min-h-0 flex-1', className)} {...(props as any)} />;
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mx-2 h-[1] bg-sidebar-border', className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col p-2', className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('h-8 px-2 py-2 text-xs font-medium text-sidebar-foreground/70', className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col', className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col gap-1', className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col', className)} {...props} />;
}

/** Closes the mobile sheet after it's tapped. Text children get a text element. */
function SidebarMenuButton({
  className,
  isActive,
  onClick,
  children,
  ...props
}: React.ComponentProps<'div'> & { isActive?: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <div
      className={cn(
        'flex h-8 flex-row items-center gap-2 rounded-md px-2 hover:bg-sidebar-accent active:bg-sidebar-accent',
        isActive && 'bg-sidebar-accent',
        className,
      )}
      onClick={(event: any) => {
        onClick?.(event);
        if (isMobile) setOpenMobile(false);
      }}
      {...props}
    >
      {React.Children.map(children, (child) =>
        typeof child === 'string' ? (
          <span
            className={cn(
              'flex-1 text-sm',
              isActive ? 'font-medium text-sidebar-accent-foreground' : 'text-sidebar-foreground',
            )}
          >
            {child}
          </span>
        ) : (
          child
        ),
      )}
    </div>
  );
}

export {
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
  useSidebar,
};
