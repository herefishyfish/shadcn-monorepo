import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/*
 * shadcn's charts are Recharts, which draws DOM SVG. These keep shadcn's shape
 * (a ChartContainer with a `config` naming each series and its color) and
 * draw the marks as SVG markup through @nativescript/canvas-svg. Labels,
 * legend and tooltip are ordinary text views, in the theme's text colors.
 *
 *   const config = {
 *     desktop: { label: 'Desktop', color: 'var(--chart-1)' },
 *     mobile: { label: 'Mobile', color: 'var(--chart-2)' },
 *   } satisfies ChartConfig;
 *
 *   <ChartContainer config={config} className="h-60">
 *     <BarChart data={data} xKey="month" />
 *   </ChartContainer>
 */

export type ChartConfig = Record<string, { label: string; color: string }>;
type Datum = Record<string, string | number>;

type ChartContextValue = {
  config: ChartConfig;
  colors: Record<string, string>;
  ink: { grid: string; surface: string };
  width: number;
  height: number;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('Charts must be inside <ChartContainer>.');
  return context;
}

/** A `var(--token)` read off the view (SVG markup can't use CSS variables). */
function resolveColor(view: View, value: string): string {
  const match = /^var\((--[\w-]+)\)$/.exec(value.trim());
  if (!match) return value;
  return ((view.style as any).getCssVariable?.(match[1]) as string | undefined)?.trim() || value;
}

/** Thousands separators without toLocaleString, which throws on Windows. */
export function formatNumber(value: number): string {
  const [whole, fraction] = String(Math.round(value * 100) / 100).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/** A round axis maximum at or above `value`, and its tick step. */
function niceScale(value: number, ticks = 4) {
  const raw = Math.max(value, 1) / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw)!;
  return { max: step * ticks, step };
}

const AXIS_WIDTH = 40;
const X_LABELS_HEIGHT = 22;

/**
 * The series colors (and grid/surface colors) as literal values, read off
 * `ref`'s view. Re-read when the theme changes: they're baked into markup.
 */
function useResolvedColors(ref: React.RefObject<View | null>, config: ChartConfig) {
  const { appearance } = useTheme();
  const [colors, setColors] = React.useState<Record<string, string>>({});
  const [ink, setInk] = React.useState({ grid: '#e5e5e5', surface: '#ffffff' });
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const view = ref.current;
      if (!view) return;
      setColors(Object.fromEntries(Object.entries(config).map(([key, c]) => [key, resolveColor(view, c.color)])));
      setInk({ grid: resolveColor(view, 'var(--border)'), surface: resolveColor(view, 'var(--card)') });
    }, 0);
    return () => clearTimeout(timer);
  }, [appearance, config]);
  return { colors, ink };
}

function ChartContainer({
  config,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { config: ChartConfig }) {
  const ref = React.useRef<View>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const { colors, ink } = useResolvedColors(ref, config);

  return (
    <ChartContext.Provider value={{ config, colors, ink, ...size }}>
      <div
        ref={ref as never}
        className={cn('relative flex h-60 w-full flex-col', className)}
        onLayoutChanged={(event: any) => {
          const { width, height } = event.object.getActualSize();
          setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
        }}
        {...props}
      >
        {size.width > 0 && children}
      </div>
    </ChartContext.Provider>
  );
}

type ChartProps = {
  data: Datum[];
  /** The category (x) field, e.g. `month`. */
  xKey: string;
  /** Formats values in the tooltip and on the axis. */
  valueFormatter?: (value: number) => string;
};

/** Tap or drag across the plot to pick a category; the tooltip shows its values. */
function usePlot({ data, xKey, valueFormatter = formatNumber }: ChartProps) {
  const chart = useChart();
  const keys = Object.keys(chart.config);
  const plotWidth = Math.max(0, chart.width - AXIS_WIDTH);
  const plotHeight = Math.max(0, chart.height - X_LABELS_HEIGHT);
  const band = data.length ? plotWidth / data.length : 0;
  const { max, step } = niceScale(Math.max(0, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0))));
  const y = (value: number) => plotHeight - (value / max) * plotHeight;
  const [active, setActive] = React.useState<number | null>(null);

  const onTouch = (event: any) => {
    if (event.action === 'cancel') return;
    const index = Math.floor(event.getX() / band);
    if (index >= 0 && index < data.length) setActive(index);
  };

  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const grid = ticks
    .map((t) => `<line x1="0" x2="${plotWidth}" y1="${y(t)}" y2="${y(t)}" stroke="${chart.ink.grid}" stroke-width="1"/>`)
    .join('');

  return { chart, keys, plotWidth, plotHeight, band, y, ticks, grid, active, setActive, onTouch, valueFormatter, data, xKey };
}

type Plot = ReturnType<typeof usePlot>;

/** The plot: y-axis labels, the SVG marks, the tooltip, then the x labels. */
function PlotFrame({ plot, markup }: { plot: Plot; markup: string }) {
  const { chart, keys, plotWidth, plotHeight, band, y, ticks, active, setActive, onTouch, valueFormatter, data, xKey } = plot;
  // Thin the x labels so they don't collide (~48dp each).
  const every = Math.max(1, Math.ceil(48 / Math.max(band, 1)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${plotWidth}" height="${plotHeight}" viewBox="0 0 ${plotWidth} ${plotHeight}">${markup}</svg>`;

  return (
    <>
      <div className="relative flex flex-1 flex-row">
        <div className="relative" style={{ width: AXIS_WIDTH, height: plotHeight }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-2 text-right text-xs text-muted-foreground"
              style={{ top: Math.max(0, y(t) - 8) }}
            >
              {valueFormatter(t)}
            </span>
          ))}
        </div>
        {/* touch-pan-y: vertical drags still scroll the page; horizontal ones pick a category.
            Hovering moves report as touch moves too, so the pointer leaving clears the pick. */}
        <div
          className="relative touch-pan-y"
          style={{ width: plotWidth, height: plotHeight }}
          onTouch={onTouch}
          onMouseLeave={() => setActive(null)}
        >
          <svg src={svg} style={{ width: plotWidth, height: plotHeight }} />
          {active !== null && (
            <div
              className="absolute flex flex-col gap-1 rounded-md border border-border bg-popover px-2.5 py-1.5"
              style={{ top: 4, left: Math.min(Math.max(0, band * active + band / 2 - 70), Math.max(0, plotWidth - 140)) }}
            >
              <span className="text-xs font-medium text-popover-foreground">{String(data[active][xKey])}</span>
              {keys.map((key) => (
                <div key={key} className="flex flex-row items-center gap-2">
                  <div className="size-2.5 rounded-[2]" style={{ backgroundColor: chart.colors[key] }} />
                  <span className="flex-1 text-xs text-muted-foreground">{chart.config[key].label}</span>
                  <span className="text-xs font-medium text-popover-foreground">
                    {valueFormatter(Number(data[active][key]) || 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row" style={{ height: X_LABELS_HEIGHT, paddingLeft: AXIS_WIDTH }}>
        {data.map((d, i) => (
          <span key={i} className="pt-1 text-center text-xs text-muted-foreground" style={{ width: band }}>
            {i % every === 0 ? String(d[xKey]) : ''}
          </span>
        ))}
      </div>
    </>
  );
}

/** Rounded data-end (4dp) on the end away from the baseline; flat at the baseline. */
function barPath(x: number, top: number, width: number, height: number) {
  const r = Math.min(4, width / 2, height);
  if (height <= 0) return '';
  return `M${x},${top + height} L${x},${top + r} Q${x},${top} ${x + r},${top} L${x + width - r},${top} Q${x + width},${top} ${x + width},${top + r} L${x + width},${top + height} Z`;
}

/** Grouped bars, one per series, side by side with a 2dp gap. */
function BarChart(props: ChartProps) {
  const plot = usePlot(props);
  const { chart, keys, band, y, plotHeight, grid, active, data } = plot;
  const gap = 2;
  const group = band * 0.7;
  const barWidth = Math.max(1, (group - gap * (keys.length - 1)) / keys.length);
  const marks = data
    .map((d, i) => {
      const highlight =
        active === i ? `<rect x="${band * i}" y="0" width="${band}" height="${plotHeight}" fill="${chart.ink.grid}" opacity="0.5"/>` : '';
      const bars = keys
        .map((key, k) => {
          const value = Number(d[key]) || 0;
          const x = band * i + (band - group) / 2 + k * (barWidth + gap);
          return `<path d="${barPath(x, y(value), barWidth, plotHeight - y(value))}" fill="${chart.colors[key] ?? '#888'}"/>`;
        })
        .join('');
      return highlight + bars;
    })
    .join('');
  return <PlotFrame plot={plot} markup={grid + marks} />;
}

/** One 2dp line per series; `area` fills beneath it. The active point gets an 8dp marker. */
function LineChart({ area = false, ...props }: ChartProps & { area?: boolean }) {
  const plot = usePlot(props);
  const { chart, keys, band, y, plotHeight, grid, active, data } = plot;
  const xAt = (i: number) => band * i + band / 2;
  const marks = keys
    .map((key) => {
      const color = chart.colors[key] ?? '#888';
      const points = data.map((d, i) => `${xAt(i)},${y(Number(d[key]) || 0)}`);
      const line = `<path d="M${points.join(' L')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      const fill = area
        ? `<path d="M${xAt(0)},${plotHeight} L${points.join(' L')} L${xAt(data.length - 1)},${plotHeight} Z" fill="${color}" opacity="0.15"/>`
        : '';
      return fill + line;
    })
    .join('');
  const crosshair =
    active === null
      ? ''
      : `<line x1="${xAt(active)}" x2="${xAt(active)}" y1="0" y2="${plotHeight}" stroke="${chart.ink.grid}" stroke-width="1"/>` +
        keys
          .map(
            (key) =>
              `<circle cx="${xAt(active)}" cy="${y(Number(data[active][key]) || 0)}" r="4" fill="${chart.colors[key] ?? '#888'}" stroke="${chart.ink.surface}" stroke-width="2"/>`,
          )
          .join('');
  return <PlotFrame plot={plot} markup={grid + crosshair + marks} />;
}

function AreaChart(props: ChartProps) {
  return <LineChart area {...props} />;
}

/**
 * The series key: a swatch and the series name, in text colors. Place it
 * after the ChartContainer, with the same `config`.
 */
function ChartLegend({ className, config, ...props }: React.ComponentProps<'div'> & { config: ChartConfig }) {
  const ref = React.useRef<View>(null);
  const { colors } = useResolvedColors(ref, config);
  return (
    <div
      ref={ref as never}
      className={cn('flex flex-row flex-wrap items-center justify-center gap-4 pt-3', className)}
      {...props}
    >
      {Object.entries(config).map(([key, c]) => (
        <div key={key} className="flex flex-row items-center gap-1.5">
          <div className="size-2.5 rounded-[2]" style={{ backgroundColor: colors[key] }} />
          <span className="text-xs text-muted-foreground">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

/** The same data as a table, for reading exact values (and for color-blind or print use). */
function ChartTable({
  config,
  data,
  xKey,
  xLabel = '',
  valueFormatter = formatNumber,
}: ChartProps & { config: ChartConfig; xLabel?: string }) {
  const keys = Object.keys(config);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{xLabel}</TableHead>
          {keys.map((key) => (
            <TableHead key={key} className="text-right">
              {config[key].label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((d, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{String(d[xKey])}</TableCell>
            {keys.map((key) => (
              <TableCell key={key} className="text-right">
                {valueFormatter(Number(d[key]) || 0)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { AreaChart, BarChart, ChartContainer, ChartLegend, ChartTable, LineChart, useChart };
