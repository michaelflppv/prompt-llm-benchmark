import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("section", className)} {...props} />;
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, align = "left", children }: SectionHeaderProps) {
  return (
    <div className={cn("section-header", align === "center" && "center")}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
      {children}
    </div>
  );
}
