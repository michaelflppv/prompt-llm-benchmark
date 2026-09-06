"use client";

import { useState, useRef, useEffect } from "react";
import { downloads, type OSKey } from "@/lib/downloads";
import { cn } from "@/lib/cn";

type DownloadButtonProps = {
  selectedOs: OSKey;
  onSelectOs: (os: OSKey) => void;
  onDownload?: () => void;
};

const osOptions: Array<{ key: OSKey; label: string; detail: string }> = [
  { key: "mac", label: ".dmg", detail: "Apple Silicon" },
  { key: "windows", label: ".exe", detail: "Windows ARM64" },
  { key: "linux", label: ".AppImage", detail: "Linux ARM64" }
];

export function DownloadButton({ selectedOs, onSelectOs, onDownload }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = downloads[selectedOs];
  const currentOption = osOptions.find((opt) => opt.key === selectedOs) || osOptions[0];
  const selectedIndex = osOptions.findIndex((opt) => opt.key === selectedOs);

  useEffect(() => {
    if (!isOpen) return;

    const wrapper = wrapperRef.current;

    function handlePointerDown(event: MouseEvent) {
      if (wrapper && !wrapper.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (wrapper && !wrapper.contains(event.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    wrapper?.addEventListener("focusout", handleFocusOut);

    // Move focus to the currently selected option when the menu opens.
    optionRefs.current[selectedIndex >= 0 ? selectedIndex : 0]?.focus();

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      wrapper?.removeEventListener("focusout", handleFocusOut);
    };
  }, [isOpen, selectedIndex]);

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleDownload = () => {
    setIsOpen(false);
    onDownload?.();
    window.location.href = selected.href;
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusIndex = optionRefs.current.findIndex((el) => el === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndRestoreFocus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = (focusIndex + 1) % osOptions.length;
      optionRefs.current[next]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (focusIndex - 1 + osOptions.length) % osOptions.length;
      optionRefs.current[prev]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      optionRefs.current[osOptions.length - 1]?.focus();
    }
  };

  return (
    <div className="download-button-wrapper" ref={wrapperRef}>
      <div className="download-button-group">
        <a
          href={selected.href}
          download
          onClick={(e) => {
            e.preventDefault();
            handleDownload();
          }}
          className="download-button-main"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Free
        </a>
        <button
          ref={triggerRef}
          type="button"
          className="download-button-dropdown"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Select platform, currently ${currentOption.label} (${currentOption.detail})`}
        >
          <span className="download-button-platform">
            {currentOption.label} ({currentOption.detail})
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn("download-button-arrow", isOpen && "open")}
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="download-button-menu"
          role="listbox"
          aria-label="Choose a platform"
          onKeyDown={handleMenuKeyDown}
        >
          {osOptions.map((option, index) => (
            <button
              key={option.key}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              type="button"
              role="option"
              aria-selected={option.key === selectedOs}
              className={cn(
                "download-button-option",
                option.key === selectedOs && "selected"
              )}
              onClick={() => {
                onSelectOs(option.key);
                closeAndRestoreFocus();
              }}
            >
              <div className="download-button-option-content">
                <span className="download-button-option-label">
                  {option.label} ({option.detail})
                </span>
                <span className="download-button-option-detail">
                  {downloads[option.key].requirements}
                </span>
              </div>
              {option.key === selectedOs && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                  <path
                    d="M13 4L6 11L3 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
