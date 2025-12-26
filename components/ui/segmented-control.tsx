"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SegmentedOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps = {
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

export function SegmentedControl({ value, options, onChange, ariaLabel, className }: SegmentedControlProps) {
  const activeIndex = options.findIndex((option) => option.value === value);

  const moveFocus = (direction: number) => {
    const nextIndex = (activeIndex + direction + options.length) % options.length;
    onChange(options[nextIndex].value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      onChange(options[0].value);
    }
    if (event.key === "End") {
      event.preventDefault();
      onChange(options[options.length - 1].value);
    }
  };

  return (
    <div className={cn("segmented", className)} role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          tabIndex={value === option.value ? 0 : -1}
          className={cn("segmented-button", value === option.value && "active")}
          onClick={() => onChange(option.value)}
          onKeyDown={handleKeyDown}
        >
          {option.icon ? <span aria-hidden="true">{option.icon}</span> : null}
          {option.label}
        </button>
      ))}
    </div>
  );
}
