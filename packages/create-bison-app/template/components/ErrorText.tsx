import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

/** Renders error text under form inputs */
export function ErrorText({
  children,
  className,
  ...textProps
}: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) {
  return (
    <span {...textProps} className={cn('text-red-500 text-sm text-right mt-1', className)}>
      {children}
    </span>
  );
}
