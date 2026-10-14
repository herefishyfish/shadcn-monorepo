// Installs DOMiNATIVE's DOM, which React renders into.
import '@nativescript-community/react';
import { makeView, registerElement, scope } from 'dominative';
import { View } from '@triniwiz/nativescript-masonkit';
import { getMasonKitElements } from '@triniwiz/nativescript-masonkit/elements';
import { Svg } from '@nativescript/canvas-svg';

// Start every MasonKit element from Tailwind's preflight baseline
// (border-box, no UA margins/padding). Must run before any view is created.
View.preflight = true;

/**
 * Teaches DOMiNATIVE to put children, text nodes included, into a MasonKit
 * container in the order React gives them.
 */
function masonContainer(base: any) {
  const view: any = makeView(base, { childrenPolicy: 'layout' });

  return class MasonElement extends view {
    constructor(...args: any[]) {
      super(...args);
      this.__dominative_role = 'Layout';
    }

    __dominative_onInsertChild(child: any, ref: any) {
      if (child.nodeType === 3) {
        try {
          super.insertBefore(child, ref ?? child.nextSibling ?? null);
        } catch {
          super.insertBefore(child, ref ?? null);
        }
        return;
      }
      if (!ref) {
        const next = child.nextSibling;
        if (next != null) {
          try {
            super.insertBefore(child, next);
            return;
          } catch {
            // Falls through to append.
          }
        }
        this.addChild(child);
        return;
      }
      super.__dominative_onInsertChild(child, ref);
    }

    __dominative_onRemoveChild(child: any) {
      if (child.nodeType === 3) {
        super.removeChild(child);
        return;
      }
      super.__dominative_onRemoveChild(child);
    }
  };
}

// MasonKit's elements (<view>, <text>, <scroll>, <button>, <input>, ...) and
// the HTML-shaped ones (<div>, <section>, <h1>, <p>, <span>, ...).
// DOMiNATIVE registers some tags (`button`, `span`, ...) for core NativeScript
// views; drop those so MasonKit's win.
for (const { tag, ctor, isContainer } of getMasonKitElements()) {
  const key = tag.toLowerCase();
  delete (scope as any)[key];
  registerElement(key, isContainer ? masonContainer(ctor) : makeView(ctor, {}));
}

// <svg src={markup}>, drawn by @nativescript/canvas-svg. Charts render with it.
delete (scope as any).svg;
registerElement('svg', makeView(Svg, {}));
