import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button — adapted to the Innvntory design system.
 *
 * The default variant maps to the ink (near-black) primary action from
 * docs/DESIGN-SYSTEM.md. Variants were re-specified against Innvntory tokens rather
 * than kept at shadcn defaults, so the library integrates with the existing design
 * instead of replacing it.
 *
 * Every state required by DESIGN-SYSTEM.md §13 is handled: default, hover,
 * focus-visible, active, and disabled.
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md " +
    "text-sm font-medium leading-none transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
    "disabled:pointer-events-none disabled:bg-surface-muted disabled:text-ink-disabled " +
    "[&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Black primary CTA — the approved Innvntory direction.
        default: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "border border-hairline-strong bg-surface text-ink hover:bg-surface-muted",
        ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink",
        outline:
          "border border-hairline-strong bg-transparent text-ink hover:bg-surface-muted",
        link: "text-ink underline underline-offset-4 hover:text-ink-secondary",
      },
      size: {
        sm: "h-8 px-3 text-[0.8125rem]",
        default: "h-10 px-4",
        lg: "h-11 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        // Default to "button" so a button inside a form never submits by accident.
        type={asChild ? undefined : (type ?? "button")}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };