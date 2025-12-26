import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("logo", className)}>
      <span className="logo-mark" aria-hidden="true">
        <span />
      </span>
      Prompt LLM Bench
    </span>
  );
}
