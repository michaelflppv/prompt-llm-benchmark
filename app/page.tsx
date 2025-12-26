import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DownloadSection } from "@/components/download/download-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardIcon, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { IconChart, IconCloud, IconShield, IconSpark, IconWorkflow } from "@/components/ui/icons";

const featureItems = [
  {
    title: "Benchmark orchestration",
    description: "Define prompt suites, datasets, and model pools.",
    icon: <IconWorkflow width={20} height={20} />
  },
  {
    title: "Insightful metrics",
    description: "Track latency, quality, and cost with focused views.",
    icon: <IconChart width={20} height={20} />
  },
  {
    title: "Offline-ready workspace",
    description: "Run evaluations locally with full control.",
    icon: <IconCloud width={20} height={20} />
  },
  {
    title: "Prompt iteration",
    description: "Compare revisions and export findings.",
    icon: <IconSpark width={20} height={20} />
  }
];

const logos = ["VectorMind", "Orion Data", "Kitebase", "Arcadio"];

const valuePoints = [
  {
    title: "Repeatable experiments",
    description: "Captured with consistent inputs and metrics.",
    icon: <IconShield width={20} height={20} />
  },
  {
    title: "Flexible deployment",
    description: "Local, offline, or synced when ready.",
    icon: <IconCloud width={20} height={20} />
  }
];

const faqItems = [
  {
    id: "faq-install",
    title: "Does it work offline?",
    content: "Yes. Prompt LLM Bench runs completely offline on your local machine. All evaluations, data processing, and storage happen locally. You can optionally sync results to a remote backend when connected, but it's not required for core functionality."
  },
  {
    id: "faq-data",
    title: "Where is data stored?",
    content: "All benchmark data, run artifacts, and results are stored in your local workspace directory. You maintain full control over your data with no automatic cloud uploads. The workspace location is configurable during initial setup."
  },
  {
    id: "faq-models",
    title: "Which models are supported?",
    content: "Prompt LLM Bench supports multiple backends including Transformers (HuggingFace), llama.cpp, and Ollama. You can benchmark any model compatible with these frameworks, including both local and API-based models."
  },
  {
    id: "faq-platforms",
    title: "What platforms are supported?",
    content: "Available for macOS (Apple Silicon), Windows (ARM64), and Linux (ARM64). Intel/AMD x64 builds are available upon request for enterprise deployments."
  },
  {
    id: "faq-export",
    title: "Can I export results?",
    content: "Yes. All benchmark results can be exported in multiple formats including Parquet, JSON, and Markdown. The tool generates detailed reports with metrics, visualizations, and recommendations for easy sharing with your team."
  }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="main-shell">
        <div className="container">
          <section className="hero" id="home">
            <div className="hero-grid">
              <div>
                <Badge>Desktop release</Badge>
                <h1 className="hero-title">Benchmark prompts with confidence.</h1>
                <p className="hero-description">
                  A focused desktop workspace for structured prompt evaluation.
                </p>
                <div className="hero-actions">
                  <Button href="/download" variant="primary">
                    Download
                  </Button>
                  <Button href="#features" variant="secondary">
                    See features
                  </Button>
                </div>
              </div>
              <div className="hero-visual">
                <div className="visual-accent"></div>
                <div className="visual-content">
                  <h3>Multi-platform support</h3>
                  <p>macOS • Windows • Linux</p>
                </div>
              </div>
            </div>
          </section>

          <Section>
            <SectionHeader
              eyebrow="See it in action"
              title="Watch the demo"
              description="See how Prompt LLM Bench helps you run structured benchmarks and compare results."
              align="center"
            />
            <div className="demo-container">
              <video
                className="demo-video"
                controls
                preload="metadata"
              >
                <source src="/demo/demo_video.MOV" type="video/quicktime" />
                <source src="/demo/demo_video.MOV" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </Section>

          <DownloadSection
            id="download"
            eyebrow="Download"
            title="Get Prompt LLM Bench"
            description="Choose your platform and follow the guided install steps."
            variant="full"
            showSteps={false}
          />

          <Section>
            <div className="logos-wrapper">
              <span className="logos-label">Trusted by</span>
              <div className="logos-grid">
                {logos.map((logo) => (
                  <div key={logo} className="logo-tile">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="features">
            <SectionHeader
              eyebrow="Features"
              title="Everything you need"
            />
            <div className="features-grid">
              {featureItems.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="divider"></div>

          <Section>
            <div className="value-grid">
              {valuePoints.map((point) => (
                <div key={point.title} className="value-card">
                  <div className="value-icon">{point.icon}</div>
                  <h3 className="value-title">{point.title}</h3>
                  <p className="value-description">{point.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="faq">
            <SectionHeader
              eyebrow="FAQ"
              title="Quick answers"
              description="Everything you need before you install."
            />
            <Accordion items={faqItems} />
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
