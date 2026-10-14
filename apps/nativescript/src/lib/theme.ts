import { useSyncExternalStore } from 'react';
import { Application, Utils, isAndroid } from '@nativescript/core';

type Appearance = 'light' | 'dark';

// Read on first use: on Android the system appearance isn't available until
// the app has started, so it can't be read when this module loads.
let appearance: Appearance | undefined;
function current(): Appearance {
  return (appearance ??= Application.systemAppearance() === 'dark' ? 'dark' : 'light');
}
// Follow the OS until the user picks an appearance.
let followSystem = true;
const listeners = new Set<() => void>();

function set(value: Appearance) {
  appearance = value;
  listeners.forEach((listener) => listener());
}

Application.on(Application.systemAppearanceChangedEvent, (args: any) => {
  if (followSystem) set(args.newValue);
});

let barsHandlerInstalled = false;

/**
 * Android's status and navigation bar icons follow the system theme unless
 * told otherwise: install a handler that reports the app's appearance, then
 * re-apply edge-to-edge so the bars pick it up. (On iOS, `status-bar-style`
 * in src/app.css does this.)
 */
function syncAndroidSystemBars() {
  if (!isAndroid) return;
  const activity = Application.android.foregroundActivity ?? Application.android.startActivity;
  if (!activity) return;
  if (!barsHandlerInstalled) {
    barsHandlerInstalled = true;
    // Core keeps the first handler it's given, so read the state when called.
    Utils.android.setDarkModeHandler({ activity, handler: () => current() === 'dark' });
  }
  Utils.android.refreshEdgeToEdge(activity);
}

function setAppearance(value: Appearance) {
  followSystem = false;
  // systemAppearanceChanged() is a no-op while auto is off, so switch it on
  // just for this call, then off again so the OS stops overriding the choice.
  Application.setAutoSystemAppearanceChanged(true);
  Application.systemAppearanceChanged(Application.getRootView(), value);
  Application.setAutoSystemAppearanceChanged(false);
  set(value);
  syncAndroidSystemBars();
}

function toggle() {
  setAppearance(current() === 'dark' ? 'light' : 'dark');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * The current appearance, plus a way to override it. Setting it swaps
 * `.ns-light` / `.ns-dark` on the root view, which re-resolves every
 * shadcn token in src/app.css.
 */
export function useTheme() {
  const value = useSyncExternalStore(subscribe, current);
  return { appearance: value, setAppearance, toggle };
}
