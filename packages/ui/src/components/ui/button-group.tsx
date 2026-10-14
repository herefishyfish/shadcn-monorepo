import * as React from 'react';
import { cn } from '../../lib/utils';

// Squares the inner corners of the buttons it holds (shadcn does this with
// `[&>*]` selectors, which NativeScript can't match).
function ButtonGroup({
  className,
  orientation = 'horizontal',
  children,
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<any>[];
  const horizontal = orientation === 'horizontal';
  return (
    <div
      role="group"
      className={cn('flex self-start', horizontal ? 'flex-row items-stretch' : 'flex-col', className)}
      {...props}
    >
      {items.map((child, index) => {
        const first = index === 0;
        const last = index === items.length - 1;
        return React.cloneElement(child, {
          className: cn(
            child.props.className,
            horizontal
              ? cn(!first && 'rounded-l-none border-l-0', !last && 'rounded-r-none')
              : cn(!first && 'rounded-t-none border-t-0', !last && 'rounded-b-none'),
          ),
        });
      })}
    </div>
  );
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('flex flex-row items-center rounded-md border border-border bg-muted px-4 text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      className={cn('shrink-0 bg-input', orientation === 'vertical' ? 'w-[1] self-stretch' : 'h-[1] w-full', className)}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
