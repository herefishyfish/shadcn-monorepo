import { aliasTagName } from 'dominative';

// Stands in for @nativescript-community/react's own `src/dom.js` (see
// keepBrowserGlobals in react-workarounds.mjs). That module also copies every
// DOMiNATIVE class onto globalThis, replacing the runtime's `Event` and
// `EventTarget`, among others.
// React doesn't need them: it imports DOMiNATIVE's `document` directly.

// Lets JSX use lowercase tags for every DOMiNATIVE element (`<page>`, `<frame>`).
aliasTagName((tag) => tag.toLowerCase());
