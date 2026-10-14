import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './label';

function FieldSet({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-6', className)} {...props} />;
}

function FieldLegend({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('mb-3 text-base font-medium text-foreground', className)} {...props} />;
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col gap-7', className)} {...props} />;
}

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div
      role="group"
      className={cn(
        'flex w-full gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className,
      )}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 flex-col gap-1.5', className)} {...props} />;
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label {...props} />;
}

function FieldTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-sm font-medium text-foreground', className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function FieldSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('h-[1] w-full bg-border', className)} {...props} />;
}

/** Shows `children`, or the first of `errors` that has a message. */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'p'> & { errors?: ({ message?: string } | undefined)[] }) {
  const content = children ?? errors?.find((error) => error?.message)?.message;
  if (!content) return null;
  return (
    <p role="alert" className={cn('text-sm text-destructive', className)} {...props}>
      {content}
    </p>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
