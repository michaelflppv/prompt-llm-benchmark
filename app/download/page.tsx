import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DownloadSection } from "@/components/download/download-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardDescription, CardHeader, CardMeta, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloads, releaseInfo } from "@/lib/downloads";

const releaseHighlights = [
  "Multi-model comparison dashboard with side-by-side metrics visualization",
  "Enhanced offline evaluation mode with full local processing capabilities",
  "Advanced prompt diff engine showing token-level changes and version tracking",
  "Improved resource monitoring with GPU memory tracking and CPU profiling",
  "Pareto frontier analysis for optimal model selection based on accuracy-latency trade-offs",
  "PostgreSQL-based persistence layer replacing SQLite for better concurrent access",
  "Automatic prompt generation using evolutionary grammar optimization",
  "New chart exports supporting PNG, SVG, and interactive HTML formats",
  "Performance improvements: 2-3x faster evaluation pipeline with parallel processing",
  "Security enhancements including encrypted credential storage and row-level security"
];

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="main-shell">
        <div className="container">
          <section className="hero">
            <div className="hero-grid">
              <div>
                <Badge>Download center</Badge>
                <h1 className="hero-title">Get started in minutes.</h1>
                <p className="hero-description">
                  Select your platform and start evaluating prompts.
                </p>
                <div className="hero-actions">
                  <Button href="#downloads" variant="primary">
                    Download now
                  </Button>
                  <Button href="#release-notes" variant="secondary">
                    Release notes
                  </Button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="visual-accent"></div>
                <div className="visual-content">
                  <span className="visual-label">Latest</span>
                  <h3>Version {releaseInfo.version}</h3>
                  <p>All platforms supported</p>
                </div>
              </div>
            </div>
          </section>

          <DownloadSection
            id="downloads"
            eyebrow="Platform"
            title="Choose your installer"
            description="We auto-detect your OS, but you can switch any time."
            variant="full"
            showSteps
          />

          <div className="divider"></div>

          <Section id="release-notes">
            <SectionHeader
              eyebrow="Release notes"
              title={`What's new in ${releaseInfo.version}`}
            />
            <div className="release-highlights">
              {releaseHighlights.map((highlight) => (
                <div key={highlight} className="highlight-item">
                  <div className="highlight-dot"></div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
            <div className="release-meta">
              <p>Released on {new Date(releaseInfo.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="release-links">
                <a href={releaseInfo.changelog} target="_blank" rel="noopener noreferrer">
                  View full changelog →
                </a>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
