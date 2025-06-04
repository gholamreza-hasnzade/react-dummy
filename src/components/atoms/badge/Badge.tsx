import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        text: "",
        contained: "",
      },
      color: {
        default: "text-gray-600 bg-gray-100",
        success: "text-green-600 bg-green-100",
        error: "text-red-600 bg-red-100",
        warning: "text-yellow-600 bg-yellow-100",
        info: "text-blue-600 bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "text",
      color: "default",
    },
  }
)

type BadgeVariantProps = VariantProps<typeof badgeVariants>

interface BadgeProps extends Omit<React.ComponentProps<"span">, "color"> {
  variant?: BadgeVariantProps["variant"]
  color?: BadgeVariantProps["color"]
  asChild?: boolean
}

export const Badge = ({
  className,
  variant,
  color,
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  )
} 