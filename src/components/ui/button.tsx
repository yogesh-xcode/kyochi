"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button k-btn shrink-0 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "k-btn-primary",
        outline: "k-btn-secondary",
        secondary: "k-btn-secondary",
        ghost: "k-btn-ghost",
        tertiary: "k-btn-ghost",
        destructive: "k-btn-destructive",
        "destructive-outline": "k-btn-destructive-outline",
        link: "border-0 bg-transparent px-0 py-0 text-[var(--k-color-brand)] underline-offset-4 hover:underline",
        dark: "k-btn-dark",
      },
      size: {
        default: "",
        xs: "k-btn-sm",
        sm: "k-btn-md",
        md: "k-btn-md",
        lg: "k-btn-lg",
        icon: "k-btn-icon",
        "icon-xs": "k-btn-icon k-btn-icon-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "k-btn-icon k-btn-icon-md",
        "icon-lg": "k-btn-icon size-10 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
