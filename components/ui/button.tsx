import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  href?: string;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className,
  href,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "outline" && "btn-outline",
    variant === "ghost" && "btn-ghost",
    variant === "icon" && "btn-icon",
    size === "sm" && "btn-sm",
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" ? <span aria-hidden="true">{icon}</span> : null}
      {children}
      {icon && iconPosition === "right" ? <span aria-hidden="true">{icon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type ?? "button"} {...props}>
      {content}
    </button>
  );
}
