import { fileURLToPath } from 'node:url';

/**
 * @returns {import('vite').Plugin[]}
 */
export function nativescriptReact() {
  return [keepBrowserGlobals(), stableEventListeners()];
}

/**
 * Keeps @nativescript-community/react from replacing runtime globals.
 *
 * The renderer's `src/dom.js` calls DOMiNATIVE's `globalRegister(globalThis)`,
 * which copies every element class onto globalThis: `Image`, `Document`,
 * `Event`, `EventTarget`, `HTMLElement`, `Frame`, ... That replaces the iOS
 * runtime's own `Event` and `EventTarget`, and the globals browser libraries
 * expect. This resolves that one import to src/react-dom.ts, which keeps the
 * rest of what it does.
 *
 * @returns {import('vite').Plugin}
 */
function keepBrowserGlobals() {
  const RENDERER = /[\\/]node_modules[\\/]@nativescript-community[\\/]react[\\/]src[\\/]renderer\.js$/;
  const replacement = fileURLToPath(new URL('./src/react-dom.ts', import.meta.url)).replace(/\\/g, '/');

  return {
    name: 'nativescript-react-keep-browser-globals',
    enforce: 'pre',
    resolveId: {
      order: 'pre',
      handler(source, importer) {
        if (source === './dom.js' && importer && RENDERER.test(importer.split('?')[0])) {
          return replacement;
        }
        return null;
      },
    },
  };
}

/**
 * Keeps one native listener per event while React swaps handlers.
 *
 * The renderer's `setEvent` removes the old handler and adds the new one
 * whenever its identity changes, which is every render for an inline arrow.
 * On iOS, removing the last `touch` listener detaches core's
 * UIGestureRecognizer, and its replacement never sees the touch in progress:
 * a handler that sets state on `down` gets no `move` or `up` after it. This
 * binds one listener per event that calls the latest handler, like React DOM.
 *
 * @returns {import('vite').Plugin}
 */
function stableEventListeners() {
  const PROPS = /[\\/]node_modules[\\/]@nativescript-community[\\/]react[\\/]src[\\/]props\.js$/;
  const SET_EVENT = /const setEvent = \(node, propName, value, prev\) => \{[^}]*\};/;
  const STABLE = `const setEvent = (node, propName, value) => {
  const eventName = eventNameFor(propName);
  const handlers = node.__reactHandlers || (node.__reactHandlers = {});
  const entry = handlers[eventName];
  if (entry && value) {
    entry.handler = value;
  } else if (value) {
    const next = (handlers[eventName] = { handler: value, listener: (...args) => next.handler(...args) });
    node.addEventListener(eventName, next.listener);
  } else if (entry) {
    node.removeEventListener(eventName, entry.listener);
    delete handlers[eventName];
  }
};`;

  return {
    name: 'nativescript-react-stable-event-listeners',
    enforce: 'pre',
    transform(code, id) {
      if (!PROPS.test(id.split('?')[0])) return null;
      if (!SET_EVENT.test(code)) {
        this.warn('setEvent not found; handlers that change identity may drop iOS touches.');
        return null;
      }
      return { code: code.replace(SET_EVENT, STABLE), map: null };
    },
  };
}
