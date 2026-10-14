/**
 * Makes shadcn themes work as written in NativeScript.
 *
 * - `oklch()` becomes `rgb()`/`rgba()`: core doesn't parse `oklch`, and
 *   Tailwind only lowers it in production builds.
 * - Opacity modifiers on theme tokens (`bg-primary/20`) compile to
 *   `color-mix(in oklab, var(--primary) 20%, transparent)`, which core can't
 *   evaluate, so the static light-mode fallback wins, even in dark mode. Each
 *   one becomes `var(--primary-mix-20)`, defined next to `--primary` in every
 *   rule that sets it (`:root`, `.ns-dark`, ...), so it switches with the theme.
 * - `.dark` becomes `.ns-dark`, the class NativeScript puts on the root view,
 *   so a theme pasted from ui.shadcn.com works unchanged.
 *
 * Runs in `OnceExit`, after Tailwind has generated everything.
 */

const OKLCH = /oklch\(\s*([^)]+)\)/g;
const TOKEN_MIX = /color-mix\(in [a-z]+,\s*var\((--[\w-]+)\)\s+([\d.]+)%,\s*transparent\)/g;

/** @returns {import('postcss').Plugin} */
export function nativeColors() {
  return {
    postcssPlugin: 'native-colors',
    OnceExit(root) {
      root.walkRules((rule) => {
        if (rule.selector === '.dark') rule.selector = '.ns-dark';
      });

      // Token -> the mix percentages used with it.
      const mixes = new Map();
      root.walkDecls((decl) => {
        if (decl.value.includes('oklch(')) {
          decl.value = decl.value.replace(OKLCH, (match, args) => oklchToRgb(args) ?? match);
        }
        if (decl.value.includes('color-mix(')) {
          decl.value = decl.value.replace(TOKEN_MIX, (_, token, percent) => {
            if (!mixes.has(token)) mixes.set(token, new Set());
            mixes.get(token).add(percent);
            return `var(${mixName(token, percent)})`;
          });
        }
      });

      if (mixes.size === 0) return;
      root.walkDecls((decl) => {
        const percents = mixes.get(decl.prop);
        if (!percents) return;
        const color = parseColor(decl.value);
        if (!color) return;
        for (const percent of percents) {
          const alpha = round(color.a * (Number(percent) / 100), 3);
          decl.cloneAfter({
            prop: mixName(decl.prop, percent),
            value: `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
          });
        }
      });
    },
  };
}
nativeColors.postcss = true;

function mixName(token, percent) {
  return `${token}-mix-${percent.replace('.', '_')}`;
}

function round(value, digits) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}

function parseAlpha(value) {
  if (value === undefined) return 1;
  return value.endsWith('%') ? parseFloat(value) / 100 : parseFloat(value);
}

/** `#rgb`, `#rrggbb(aa)`, `rgb(...)` or `rgba(...)` → channels, or null. */
function parseColor(value) {
  const v = value.trim();
  const hex = /^#([\da-f]{3,8})$/i.exec(v);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? round(n(6) / 255, 3) : 1 };
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(v);
  if (rgb) {
    return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a: parseAlpha(rgb[4]) };
  }
  return null;
}

/** `L C H [/ A]` (the inside of `oklch()`) → `rgb()`/`rgba()`, or null. */
function oklchToRgb(args) {
  const [lch, alphaPart] = args.split('/').map((s) => s.trim());
  const parts = lch.split(/\s+/);
  if (parts.length !== 3 || parts.some((p) => p === 'none' || p.includes('var('))) return null;
  const L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
  const C = parseFloat(parts[1]);
  const H = (parseFloat(parts[2]) * Math.PI) / 180;
  const alpha = parseAlpha(alphaPart);
  if ([L, C, H, alpha].some(Number.isNaN)) return null;

  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const channel = (x) => {
    const v = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  };
  const r = channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = channel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  return alpha === 1 ? `rgb(${r}, ${g}, ${bl})` : `rgba(${r}, ${g}, ${bl}, ${round(alpha, 3)})`;
}
