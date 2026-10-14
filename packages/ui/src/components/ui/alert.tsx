import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const alertVariants = cva(
  'flex w-full flex-col gap-0.5 rounded-lg border border-border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'bg-card text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type AlertVariant = VariantProps<typeof alertVariants>['variant'];

// Lets AlertDescription match the alert's variant (shadcn does this with a
// `*:data-[slot=alert-description]` selector, which NativeScript can't match).
const AlertVariantContext = React.createContext<AlertVariant>('default');

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <AlertVariantContext.Provider value={variant}>
      <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
    </AlertVariantContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm font-medium', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const variant = React.useContext(AlertVariantContext);
  return (
    <p
      className={cn(
        'text-sm',
        variant === 'destructive' ? 'text-destructive/90' : 'text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
