import { Section, SectionHeader } from "@/components/ui/section";
import { DownloadPanel } from "@/components/download/download-panel";

export type DownloadSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  variant?: "compact" | "full";
  showSteps?: boolean;
};

export function DownloadSection({
  id,
  eyebrow,
  title,
  description,
  variant = "full",
  showSteps = true
}: DownloadSectionProps) {
  return (
    <Section id={id}>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="card">
        <DownloadPanel variant={variant} showSteps={showSteps} />
      </div>
    </Section>
  );
}
