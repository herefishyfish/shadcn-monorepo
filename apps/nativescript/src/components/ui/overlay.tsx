import * as React from 'react';
import { reconciler } from '@nativescript-community/react';
import { Application, CoreTypes, Screen, isAndroid, type View } from '@nativescript/core';
import { cn } from '@/lib/utils';

/*
 * The layer that dialogs, sheets, menus and toasts render into, standing in
 * for the web's `position: fixed` and portals. Wrap each screen in an
 * <OverlayProvider> (src/app.tsx and src/navigation.tsx do this). Content
 * rendered with <Portal> stays in the React tree, so context still works.
 */

type OverlayContextValue = {
  /** The provider's own view: always laid out, the layers' coordinate space. */
  root: View | null;
  host: View | null;
  toastHost: View | null;
  floatingHost: View | null;
  register: () => () => void;
};

const OverlayContext = React.createContext<OverlayContextValue | null>(null);

function useOverlay() {
  const context = React.useContext(OverlayContext);
  if (!context) throw new Error('Overlays need an <OverlayProvider> around the screen.');
  return context;
}

function OverlayProvider({ className, children, ...props }: React.ComponentProps<'div'>) {
  const [root, setRoot] = React.useState<View | null>(null);
  const [host, setHost] = React.useState<View | null>(null);
  const [toastHost, setToastHost] = React.useState<View | null>(null);
  const [floatingHost, setFloatingHost] = React.useState<View | null>(null);
  const [count, setCount] = React.useState(0);
  const register = React.useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);
  const value = React.useMemo(
    () => ({ root, host, toastHost, floatingHost, register }),
    [root, host, toastHost, floatingHost, register],
  );

  return (
    <OverlayContext.Provider value={value}>
      <div ref={setRoot as never} className={cn('relative flex size-full flex-col', className)} {...props}>
        {children}
        {/* Only there while something is open: even hidden, it would take taps. */}
        {count > 0 && <div ref={setHost as never} className="absolute inset-0" />}
        {/* Sized by its toasts, so it only covers what it shows. */}
        <div ref={setToastHost as never} className="absolute right-4 bottom-10 left-4 flex flex-col gap-2" />
        {/* Zero-size, at the top-left: tooltips position themselves in it
            without covering (and taking the pointer from) what they point at. */}
        <div ref={setFloatingHost as never} className="absolute top-0 left-0" />
      </div>
    </OverlayContext.Provider>
  );
}

/**
 * Renders `children` into the overlay layer, which covers the screen while
 * anything is in it; or into the toast or floating layers, which don't.
 */
function Portal({
  children,
  toast = false,
  floating = false,
}: {
  children: React.ReactNode;
  toast?: boolean;
  floating?: boolean;
}) {
  const { host, toastHost, floatingHost, register } = useOverlay();
  const modal = !toast && !floating;
  React.useLayoutEffect(() => (modal ? register() : undefined), [modal, register]);
  const container = toast ? toastHost : floating ? floatingHost : host;
  if (!container) return null;
  return reconciler.createPortal(children, container, null, null);
}

/** Calls `onBack` instead of leaving the screen when Android's back button is pressed. */
function useBackButton(onBack: () => void) {
  const latest = React.useRef(onBack);
  latest.current = onBack;
  React.useEffect(() => {
    if (!isAndroid) return;
    const handler = (args: any) => {
      args.cancel = true;
      latest.current();
    };
    Application.android.on('activityBackPressed', handler);
    return () => Application.android.off('activityBackPressed', handler);
  }, []);
}

type Enter = { opacity?: number; x?: number; y?: number; scale?: number };

/** Animates a view in from `from` when it mounts. */
function useEnter(ref: React.RefObject<View | null>, from: Enter) {
  React.useLayoutEffect(() => {
    const view = ref.current;
    if (!view) return;
    view.opacity = from.opacity ?? 1;
    view.translateX = from.x ?? 0;
    view.translateY = from.y ?? 0;
    view.scaleX = view.scaleY = from.scale ?? 1;
    const settle = () => {
      view.opacity = view.scaleX = view.scaleY = 1;
      view.translateX = view.translateY = 0;
    };
    const run = () =>
      view
        .animate({
          opacity: 1,
          translate: { x: 0, y: 0 },
          scale: { x: 1, y: 1 },
          duration: 180,
          curve: CoreTypes.AnimationCurve.easeOut,
        })
        .catch(settle);
    // Views that open with the screen aren't loaded yet, and animate() rejects.
    if (view.isLoaded) run();
    else view.once('loaded', run);
  }, []);
}

/** Bounds of `view` in `container`'s coordinates (dp). */
function boundsIn(view: View, container: View) {
  const point = view.getLocationRelativeTo(container);
  const size = view.getActualSize();
  return point ? { x: point.x, y: point.y, width: size.width, height: size.height } : null;
}

/**
 * A full-screen backdrop with `children` laid out on it. A touch that starts
 * and ends outside `panelRef` dismisses it. (A tap handler on the backdrop
 * would also fire for taps inside the panel on iOS.)
 */
function ModalLayer({
  className,
  panelRef,
  onDismiss,
  dismissible = true,
  children,
}: {
  className?: string;
  panelRef: React.RefObject<View | null>;
  onDismiss: () => void;
  dismissible?: boolean;
  children: React.ReactNode;
}) {
  const ref = React.useRef<View>(null);
  const startedOutside = React.useRef(false);
  useBackButton(() => dismissible && onDismiss());

  const outside = (event: any) => {
    const panel = panelRef.current;
    const layer = ref.current;
    if (!panel || !layer) return true;
    const b = boundsIn(panel, layer);
    if (!b) return true;
    const x = event.getX();
    const y = event.getY();
    return x < b.x || x > b.x + b.width || y < b.y || y > b.y + b.height;
  };

  return (
    <div
      ref={ref as never}
      className={cn('absolute inset-0', className)}
      onTouch={(event: any) => {
        if (event.action === 'down') startedOutside.current = outside(event);
        if (event.action === 'up' && dismissible && startedOutside.current && outside(event)) {
          onDismiss();
        }
      }}
    >
      {children}
    </div>
  );
}

/** A dimmed, fading backdrop, for dialogs and sheets. */
function Scrim() {
  const ref = React.useRef<View>(null);
  useEnter(ref, { opacity: 0 });
  return <div ref={ref as never} className="absolute inset-0 bg-black/50" />;
}

/**
 * Where to place a popover for `anchor`: below it, or above it when it sits
 * in the lower half of the screen. Measured against the provider's root (the
 * layers share its coordinates and, unlike a layer that has only just been
 * added, it's already laid out). Pass `onPanelLayout` to the panel's
 * `onLayoutChanged` to keep it on screen once its size is known.
 */
function useAnchorPosition(anchor: React.RefObject<View | null>) {
  const { root } = useOverlay();
  const [style, setStyle] = React.useState<Record<string, number> | null>(null);

  React.useLayoutEffect(() => {
    if (!anchor.current || !root) return;
    const b = boundsIn(anchor.current, root);
    if (!b) return;
    const height = root.getActualSize().height || Screen.mainScreen.heightDIPs;
    setStyle(
      b.y + b.height / 2 > height / 2
        ? { left: b.x, bottom: height - b.y + 4, minWidth: b.width }
        : { left: b.x, top: b.y + b.height + 4, minWidth: b.width },
    );
  }, [root]);

  const onPanelLayout = React.useCallback(
    (event: any) => {
      if (!root) return;
      const panel = event.object as View;
      const { width, height } = panel.getActualSize();
      const screen = root.getActualSize();
      const margin = 8;
      setStyle((current) => {
        if (!current || !width) return current;
        const next = { ...current };
        if (next.left + width > screen.width - margin) next.left = Math.max(margin, screen.width - width - margin);
        if (next.top !== undefined && next.top + height > screen.height - margin) {
          next.top = Math.max(margin, screen.height - height - margin);
        }
        if (next.bottom !== undefined && screen.height - next.bottom - height < margin) {
          next.bottom = Math.max(margin, screen.height - height - margin);
        }
        const changed = next.left !== current.left || next.top !== current.top || next.bottom !== current.bottom;
        return changed ? next : current;
      });
    },
    [root],
  );

  return { style, onPanelLayout };
}

export {
  OverlayProvider,
  Portal,
  ModalLayer,
  Scrim,
  useOverlay,
  useBackButton,
  useEnter,
  useAnchorPosition,
};
