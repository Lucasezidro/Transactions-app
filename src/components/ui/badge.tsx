import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        processing:
          'border-transparent bg-amber-400 text-zinc-900 shadow hover:bg-amber-400/80',
        schedulling:
          'border-transparent bg-blue-400 text-zinc-900 hover:bg-blue-400/80',
        finished:
          'border-transparent bg-emerald-400 text-zinc-900 shadow hover:bg-emerald-400/80',
      },
    },
    defaultVariants: {
      variant: 'schedulling',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
