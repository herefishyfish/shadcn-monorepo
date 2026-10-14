# NativeScript Desktop Starter: shadcn/ui (React)

A React starter for Windows, iOS and Android with
[shadcn/ui](https://ui.shadcn.com) components and themes. React renders
through [`@nativescript-community/react`](https://github.com/nativescript-community/react)
and [DOMiNATIVE](https://github.com/SudoMaker/DOMiNATIVE), so you write
ordinary JSX (`<div className="flex gap-4">`). Layout uses
[MasonKit](https://github.com/triniwiz/nativescript-mason) (Flexbox, CSS Grid
and HTML-style elements), and styling uses Tailwind CSS v4.

## Prerequisites

> NativeScript for Windows is in alpha. Expect rough edges.

To run on Windows you need the following. `npx ns doctor windows` checks them.

| Requirement | Notes |
| --- | --- |
| Windows 10 1809 (build 17763) or later | The app targets `net10.0-windows10.0.26100.0`, with a minimum of `10.0.17763.0`. |
| [Node.js](https://nodejs.org) LTS | Provides `npm` and `npx`. |
| [.NET 10 SDK](https://dotnet.microsoft.com/download) | The build runs `dotnet build`. Check it with `dotnet --version`. |
| Developer Mode | Settings → Privacy & security → For developers. Windows needs it to install and launch the unsigned debug build. |

For iOS and Android, follow the [NativeScript environment setup](https://docs.nativescript.org/setup/).

You don't need to install the NativeScript CLI globally. It's a dev dependency, and the npm scripts run it.

## Getting started

```bash
git clone https://github.com/triniwiz/nativescript-desktop-starter-template-shadcn my-app
cd my-app
npm install
npm run windows   # or: npm run ios / npm run android
```

`npm run windows` builds the app, installs and launches it, then rebuilds and
restarts it as you save. `npm run clean` removes the build output, and
`npm run typecheck` runs TypeScript.

Use npm. `package.json` relies on npm `overrides`.

## Project layout

| Path | What it's for |
| --- | --- |
| `src/app.tsx` | App entry. Sets up the DOM, then starts React with the home screen. |
| `src/dom.ts` | Loads React's DOM and registers MasonKit's elements. |
| `src/app.css` | Tailwind, the shadcn theme, and the `dark:`, `ios:`, `android:`, `windows:`, `phone:` and `tablet:` variants. |
| `src/components/ui/` | The shadcn components. |
| `canvas-workarounds.mjs` | Resolves `@nativescript/canvas`'s `./platform` import under Vite. |
| `src/components/AppShell.tsx` | The app's frame: sidebar, header and the current page. |
| `src/pages/` | Dashboard, Components (every component), Settings and Login. |
| `src/lib/utils.ts` | `cn()`, which merges class names with `clsx` and `tailwind-merge`. |
| `src/lib/theme.ts` | `useTheme()`, to read or override light/dark mode. |
| `src/navigation.tsx` | `navigate(Screen)` and `goBack()`. Each screen is its own React root on a NativeScript `Page`. |
| `types/jsx.d.ts` | JSX typings for what NativeScript adds to React's DOM ones. |
| `src/components/ui/overlay.tsx` | `OverlayProvider` and `Portal`: the layer dialogs, sheets, menus and toasts render into. |
| `components.json`, `registry.json`, `public/r/` | shadcn CLI config, and the registry these components are published from. |
| `scripts/build-registry.mjs` | `npm run registry:build`: regenerates `registry.json` and `public/r/`. |
| `postcss-native-colors.mjs` | Converts shadcn's colors for NativeScript (see [Theming](#theming)). |
| `postcss-masonkit.mjs` | Keeps the Tailwind layout utilities (`flex`, `grid`, `gap-*`, `max-w-*`, `absolute`, ...) and `hover:` styles that NativeScript's Tailwind plugin would otherwise remove. |

## shadcn/ui

The components follow shadcn: the source lives in your project, variants use
`class-variance-authority`, and `className` wins over a component's defaults.
Stateful ones take the same props as shadcn's (`checked` /
`onCheckedChange`, `value` / `onValueChange`, `defaultValue`, ...).

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function Settings() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <Button variant="outline" size="sm" onClick={save}>Save</Button>
      </CardContent>
    </Card>
  );
}
```

Included: Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge,
Breadcrumb, Button, Button Group, Calendar, Card, Checkbox, Collapsible,
Command, Context Menu, Dialog, Drawer, Dropdown Menu, Empty, Field, Input,
Input Group, Input OTP, Item, Kbd, Label, Pagination, Popover, Progress,
Radio Group, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider,
Chart (bar, line, area),
Sonner (toasts), Spinner, Switch, Table, Tabs, Textarea, Toggle, Toggle Group
and Tooltip.

**Pages.** The app opens on a shell built like shadcn's blocks:
`src/components/AppShell.tsx` puts a Sidebar beside a header and the current
page, and the sidebar becomes a slide-out sheet when the window is narrower
than 768dp. The pages in `src/pages/` are a Dashboard (stats, recent sales,
paginated orders), the Components gallery, Settings (forms built with Field,
plus shadcn's Date Picker and Combobox patterns) and a Login screen with an
OTP step, which "Sign out" opens with `navigate()`.

**Charts.** shadcn's charts are Recharts, which needs the browser's SVG.
`src/components/ui/chart.tsx` keeps their shape, a `ChartContainer` with a
`config` naming each series and its color, and draws the marks as SVG markup
with `@nativescript/canvas-svg` (`<svg src={markup}>`, registered in
`src/dom.ts`). `BarChart`, `LineChart` and `AreaChart` show a tooltip when you
tap or drag across them; `ChartLegend` and `ChartTable` sit beside them.

```tsx
const config = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

<ChartContainer config={config} className="h-60">
  <BarChart data={data} xKey="month" />
</ChartContainer>
<ChartLegend config={config} />
```

The `--chart-1…5` colors are not shadcn's defaults, whose fourth and fifth
are nearly the same color. These five pass a color-blindness check on the card
surface in both themes. Three of them are below 3:1 contrast on white, so give
charts visible values: the Dashboard pairs each chart with a Table tab.

**Tooltip and Context Menu** open on hover and right-click where the platform
reports them (Windows), and on long-press with touch.

**Overlays.** Dialogs, sheets, menus and toasts render into a layer that
`<OverlayProvider>` adds over the screen, standing in for the web's portals
and `position: fixed`. `src/app.tsx` wraps the home screen in one, and
`navigate()` wraps every screen it opens, each with a `<Toaster />`. Call
`toast('Saved')` from anywhere. On Android, the back button closes the
topmost overlay.

### Adding components with the shadcn CLI

shadcn's own components are built for the browser: they import `radix-ui`
(which needs `react-dom`) and use DOM APIs, so `npx shadcn add button`
installs code that won't run here. This repo publishes NativeScript versions
as the `@ns` registry, set up in `components.json`:

```bash
npx shadcn@latest add @ns/button @ns/switch
npx shadcn@latest add @ns/tabs --dry-run   # preview first
```

The CLI installs each component, what it depends on (`@ns/utils`,
`@ns/use-controllable`) and its npm packages, at the usual paths.

To publish your own: add the component to `src/components/ui/`, run
`npm run registry:build` to regenerate `registry.json` (dependencies are read
from each file's imports) and `public/r/`, and push. The `@ns` URL
in `components.json` points at `public/r/` on this repo's `main` branch.

### Theming

`src/app.css` holds the theme exactly as [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
generates it (`:root` and `.dark` blocks with `oklch()` colors). Paste
another theme over those two blocks and it just works:
`postcss-native-colors.mjs` converts it at build time.

- `oklch()` becomes `rgb()`, since NativeScript doesn't parse `oklch`.
- `.dark` becomes `.ns-dark`, the class NativeScript puts on the root view.
- Opacity modifiers on tokens (`bg-primary/20`) become variables, such as
  `--primary-mix-20`, set for light and dark, because NativeScript can't
  evaluate `color-mix()` with a variable in it.

Keep `--radius` unitless (dp) rather than `rem`.

Dark mode follows the OS. `useTheme()` reads it and can override it, and the
system bars follow: on iOS through `status-bar-style` on `Page` in
`src/app.css`, on Android through core's edge-to-edge dark-mode handler.

```ts
const { appearance, toggle, setAppearance } = useTheme();
```

### Porting a component

- Use MasonKit elements (`<div>`, `<span>`, `<button>`, `<input>`, `<img>`,
  `<scroll>`), and wrap text in a text element (`<span>`, `<p>`, `<label>`).
- `hover:`, `active:`, `focus:` (and `focus-visible:`) and `disabled:` work.
  Leave out `ring-*`, `shadow-*`, `outline-*`, `leading-*`, `tracking-*`,
  `@container`, and `aria-*`, `data-*`, `has-*` and `group-*` variants.
- Replace Radix primitives with plain state (see `switch.tsx` and `tabs.tsx`,
  which use `useControllable` for controlled and uncontrolled props), and
  `asChild` with `Slot` from `src/lib/slot.tsx`. Render overlays with
  `Portal` and `ModalLayer` from `overlay.tsx`, as `dialog.tsx` does.
- shadcn's lucide icons are SVG; the ported components use text glyphs
  (`✕`, `✓`, `▾`, `›`).
- `px` is a physical pixel, so write a 1dp hairline as `h-[1]`, not `h-px`.
- A control you drag inside a scroll view (a slider, a drawing area) takes
  `touch-none` (or `touch-pan-x` / `touch-pan-y`), as on the web, so the scroll
  view leaves the drag to it. MasonKit supports `touch-action` from
  1.0.0-beta.116.
- Disable a view with `isEnabled={false}`. `disabled` isn't a NativeScript
  property.

## Tips

- **Events:** NativeScript events don't bubble, and there is no synthetic event
  system. `onClick` listens for a `tap` on that element. Any other `on<Event>`
  prop listens for the NativeScript event of that name. MasonKit's `<input>`
  fires `input` as you type, so `Input` and `Textarea` map `onChange` to it.
- **Navigation:** `navigate(Screen)` pushes a page and `goBack()` pops it.
  A screen unmounts when you navigate back from it, so `useEffect` cleanups
  run then. Inside a screen, `usePage()` returns its `Page`.
- **Responsive layouts:** there are no `sm:` or `md:` breakpoints. Use layouts
  that fit the space they're given, like
  `grid-cols-[repeat(auto-fill,minmax(300,1fr))]` or `flex-wrap` with
  `basis-*`.
- **Units:** unitless values are dp, and `px` means physical pixels.
- **Animations:** Tailwind's `animate-*` utilities compile to nothing with
  `@nativescript/tailwind` 4.1 and earlier, so `animate-pulse` and
  `animate-spin` are redefined in `src/app.css`. Give your own `@keyframes`
  both a `from` (0%) and a `to` (100%) keyframe: core doesn't fill in missing
  ends the way browsers do.
- **Keep** `@import 'tailwindcss/theme'` and `@import 'tailwindcss/utilities'`
  in `src/app.css`, not `@import 'tailwindcss'`. Tailwind's preflight would
  hide every view.

## Known issues

- HMR is off: the npm scripts pass `--no-hmr`, so a save rebuilds the bundle
  and restarts the app. With HMR, `@nativescript/vite` currently serves
  CommonJS packages without their named exports (`react`, `clsx`), and the
  app fails to start.
- Needs MasonKit 1.0.0-beta.116 or later. Earlier versions draw no border
  on iOS outline buttons, draw iOS screens under the status bar, move focus
  to a text field on every Android fling, move an input's caret when its
  value is written back, and have no `touch-action` (the Slider would scroll
  the page as you drag it).

## Troubleshooting

- **Something's missing from your setup:** `npx ns doctor windows` lists what it can't find and how to fix it.
- **The app builds but won't launch** ("deployment failed"): turn on Developer Mode.
- **A stale or broken build:** run `npm run clean`, then `npm run windows` again.
  On Android, also uninstall the app: files synced to the device are never
  removed.

## Temporary workarounds

These can be removed once the fixes are released:

- `@nativescript/core` and `@nativescript/vite` are installed from a pkg.pr.new
  build (`fa5d852`) of [NativeScript/NativeScript](https://github.com/NativeScript/NativeScript).
- `@nativescript/windows` is pinned to an exact alpha, because a caret range
  would also match older, incompatible betas.
- `react-workarounds.mjs` swaps the React renderer's `src/dom.js` for
  `src/react-dom.ts`. The original copies every DOMiNATIVE class onto
  `globalThis`, replacing the runtime's own `Event` and `EventTarget`. It also
  keeps one native listener per event while handlers change: the renderer
  re-binds them on every render, and on iOS that detaches the `touch`
  recognizer mid-drag (sliders and charts only got `down`).
- `android-workarounds.mjs` names core's Android activity chunk without a
  hash. The generated Java activity loads it by the name it had at the last
  native build, so after a rebuild that renamed it, Android started the old
  chunk and crashed ("isEmbedded is not a function").
- `postcss-masonkit.mjs` keeps `touch-action` and `:hover` rules, which `@nativescript/tailwind`
  strips even though MasonKit supports them.
- `masonkit-hmr.mjs` stops MasonKit from loading twice during HMR. It only
  runs on the dev server, so it does nothing until HMR is back on.
- `postcss-selector-commas.mjs` makes classes with a comma, like
  `grid-cols-[repeat(auto-fill,minmax(240,1fr))]`, match
  ([NativeScript/NativeScript#11463](https://github.com/NativeScript/NativeScript/pull/11463)).
