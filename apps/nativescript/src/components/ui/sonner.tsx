import * as React from 'react';
import type { View } from '@nativescript/core';
import { cn } from '@/lib/utils';
import { Portal, useEnter } from '@/components/ui/overlay';

/*
 * Sonner's API: render <Toaster /> once per screen, then call
 * `toast('Saved')`, `toast.success(...)` or `toast.error(...)` from anywhere.
 */

type ToastOptions = {
  description?: React.ReactNode;
  duration?: number;
  action?: { label: string; onClick: () => void };
};
type ToastData = ToastOptions & {
  id: number;
  title: React.ReactNode;
  type: 'default' | 'success' | 'error';
};

let toasts: ToastData[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function dismiss(id?: number) {
  toasts = id === undefined ? [] : toasts.filter((t) => t.id !== id);
  emit();
}

function show(type: ToastData['type'], title: React.ReactNode, options: ToastOptions = {}) {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, title, type, ...options }];
  emit();
  setTimeout(() => dismiss(id), options.duration ?? 4000);
  return id;
}

const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) => show('default', title, options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) => show('success', title, options),
    error: (title: React.ReactNode, options?: ToastOptions) => show('error', title, options),
    dismiss,
  },
);

const icons = { default: null, success: '✓', error: '!' };

function ToastCard({ data }: { data: ToastData }) {
  const ref = React.useRef<View>(null);
  useEnter(ref, { opacity: 0, y: 24 });
  return (
    <div
      ref={ref as never}
      className="flex flex-row items-center gap-3 rounded-lg border border-border bg-popover p-4"
    >
      {icons[data.type] && (
        <span
          className={cn(
            'text-sm font-bold',
            data.type === 'error' ? 'text-destructive' : 'text-popover-foreground',
          )}
        >
          {icons[data.type]}
        </span>
      )}
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-popover-foreground">{data.title}</span>
        {data.description && (
          <span className="text-sm text-muted-foreground">{data.description}</span>
        )}
      </div>
      {data.action && (
        <button
          className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
          onClick={() => {
            data.action!.onClick();
            dismiss(data.id);
          }}
        >
          {data.action.label}
        </button>
      )}
    </div>
  );
}

function Toaster() {
  const list = React.useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => toasts,
  );
  return (
    <Portal toast>
      {list.map((data) => (
        <ToastCard key={data.id} data={data} />
      ))}
    </Portal>
  );
}

export { Toaster, toast };
