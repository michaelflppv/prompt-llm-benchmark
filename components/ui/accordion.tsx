"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
};

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn("accordion", className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id} className="accordion-item">
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              id={`trigger-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span>{item.title}</span>
              <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen ? (
              <div
                id={`panel-${item.id}`}
                role="region"
                aria-labelledby={`trigger-${item.id}`}
                className="accordion-panel"
              >
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
