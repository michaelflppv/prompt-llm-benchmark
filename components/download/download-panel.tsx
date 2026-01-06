"use client";

import { useEffect, useState } from "react";

import { downloads, detectOS, releaseInfo, type OSKey } from "@/lib/downloads";
import { DownloadButton } from "@/components/download/download-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


type DownloadPanelProps = {
  variant?: "compact" | "full";
  showSteps?: boolean;
};

export function DownloadPanel({ variant = "full", showSteps = true }: DownloadPanelProps) {
  const [selectedOs, setSelectedOs] = useState<OSKey>("mac");
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    setSelectedOs(detectOS(navigator.userAgent));
  }, []);

  useEffect(() => {
    setDownloadStarted(false);
  }, [selectedOs]);

  const selected = downloads[selectedOs];

  return (
    <div className="download-panel">
      <div className="download-meta">
        <div className="pill">Recommended for {selected.label}</div>
        <div>Architecture: {selected.architecture}</div>
        <div>{selected.requirements}</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="subtle">Version {releaseInfo.version}</Badge>
          <Badge>100% Free</Badge>
        </div>
      </div>

      <div className="download-actions">
        <DownloadButton
          selectedOs={selectedOs}
          onSelectOs={setSelectedOs}
          onDownload={() => setDownloadStarted(true)}
        />
        <Button href={releaseInfo.releaseNotesUrl} variant="outline">
          Release notes
        </Button>
      </div>

      {variant === "full" ? (
        <div className="download-links">
          <a href="/downloads/checksums.txt" download>Checksums (SHA256)</a>
          <a href="/downloads/signatures.txt" download>GPG Signatures</a>
        </div>
      ) : null}

      {downloadStarted && showSteps ? (
        <div className="alert" role="status">
          <strong>Download started</strong>
          <span>Follow these quick install steps for {selected.label}:</span>
          <ul className="steps">
            {selected.steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <div>{step}</div>
              </li>
            ))}
          </ul>
          <div className="alert-actions">
            <Button variant="ghost" size="sm" onClick={() => setDownloadStarted(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
