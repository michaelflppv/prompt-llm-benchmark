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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = downloads[selectedOs];
  const currentOption = osOptions.find((opt) => opt.key === selectedOs) || osOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDownload = () => {
    setIsOpen(false);
    if (onDownload) {
      onDownload();
    }
    window.location.href = selected.href;
  };

  return (
    <div className="download-button-wrapper" ref={dropdownRef}>
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Free
        </a>
        <button
          type="button"
          className="download-button-dropdown"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="Select platform"
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
        <div className="download-button-menu" role="listbox">
          {osOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={option.key === selectedOs}
              className={cn(
                "download-button-option",
                option.key === selectedOs && "selected"
              )}
              onClick={() => {
                onSelectOs(option.key);
                setIsOpen(false);
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
