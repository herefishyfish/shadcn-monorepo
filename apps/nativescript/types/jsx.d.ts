import 'react';

// React's DOM typings already cover the HTML-shaped MasonKit elements (<div>,
// <section>, <span>, <button>, <input>, ...). These add what NativeScript
// brings on top. `onClick` is a NativeScript `tap`; any other `on<Event>` prop
// listens for the NativeScript event of that name (`onLoaded` → `loaded`).
declare module 'react' {
  interface HTMLAttributes<T> {
    /** NativeScript's enabled state; `false` blocks taps and matches `:disabled`. */
    isEnabled?: boolean;
    /** NativeScript `touch`: `event.action` is down/move/up/cancel, `event.getX()`/`getY()` in dp. */
    onTouch?: (event: any) => void;
    /** NativeScript `longPress` (touch, or the mouse held down). */
    onLongPress?: (event: any) => void;
    /** NativeScript `layoutChanged`: the view's size or position changed. */
    onLayoutChanged?: (event: any) => void;
    /** iOS: let the view extend under the status bar and home indicator. */
    iosOverflowSafeArea?: boolean;
  }

  interface SVGAttributes<T> {
    /** SVG markup (or a path to a file) for @nativescript/canvas-svg to draw. */
    src?: string;
  }

  namespace JSX {
    interface IntrinsicElements {
      /** MasonKit's scroll container. */
      scroll: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      /** Core's ActivityIndicator: the platform's own spinner. */
      activityindicator: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        busy?: boolean;
      };
    }
  }
}
