import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DownloadSection } from "@/components/download/download-section";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardIcon, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { IconChart, IconCloud, IconShield, IconSpark, IconWorkflow, IconRocket, IconLock, IconPulse, IconCode, IconTarget, IconZap, IconDatabase } from "@/components/ui/icons";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import YouTubeAutoplayVideo from "@/components/ui/youtube-autoplay-video";
import { ContactForm } from "@/components/contact/contact-form";

const featureItems = [
  {
    title: "Multi-backend support",
    description: "Benchmark across Transformers, llama.cpp, and Ollama with automatic GPU detection.",
    icon: <IconRocket width={20} height={20} />,
    featured: true
  },
  {
    title: "Benchmark orchestration",
    description: "Define prompt suites, datasets, and model pools with YAML configurations.",
    icon: <IconWorkflow width={20} height={20} />
  },
  {
    title: "Insightful metrics",
    description: "Track latency, accuracy, memory usage, and cost with Pareto frontier analysis.",
    icon: <IconChart width={20} height={20} />
  },
  {
    title: "Offline-ready workspace",
    description: "Run evaluations locally with PostgreSQL persistence and full data control.",
    icon: <IconCloud width={20} height={20} />
  },
  {
    title: "Prompt iteration",
    description: "Compare revisions, auto-generate prompts, and export findings to multiple formats.",
    icon: <IconSpark width={20} height={20} />
  },
  {
    title: "Real-time monitoring",
    description: "Live resource tracking with Prometheus metrics and performance dashboards.",
    icon: <IconPulse width={20} height={20} />
  },
  {
    title: "Security & privacy",
    description: "Encrypted secrets, row-level security, and local-first data architecture.",
    icon: <IconLock width={20} height={20} />
  },
  {
    title: "Reproducible results",
    description: "Snapshot models and configs for every run with complete audit trail.",
    icon: <IconShield width={20} height={20} />
  }
];

const valuePoints = [
  {
    title: "Reproducible by design",
    description: "Every benchmark run captures complete environment snapshots, model configs, and dataset versions for perfect reproducibility.",
    icon: <IconShield width={20} height={20} />
  },
  {
    title: "Flexible deployment",
    description: "Run fully offline on your local machine, or sync results to remote storage when you're ready. Your choice, your control.",
    icon: <IconCloud width={20} height={20} />
  },
  {
    title: "Built for developers",
    description: "YAML-based configurations, CLI-first workflow, and REST API for seamless integration into your existing pipelines.",
    icon: <IconCode width={20} height={20} />
  },
  {
    title: "Cost-optimized selection",
    description: "Pareto frontier analysis automatically identifies the best model for your accuracy, speed, and budget constraints.",
    icon: <IconTarget width={20} height={20} />
  },
  {
    title: "Lightning fast",
    description: "Parallel execution, persistent monitors, and optimized pipelines deliver 2-3x faster results than traditional benchmarking.",
    icon: <IconZap width={20} height={20} />
  },
  {
    title: "PostgreSQL-powered",
    description: "Enterprise-grade persistence with row-level security, concurrent access, and full ACID compliance for team workflows.",
    icon: <IconDatabase width={20} height={20} />
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
                <h1 className="hero-title">Find your optimal LLM in minutes, not weeks.</h1>
                <p className="hero-description">
                  Benchmark prompt strategies across multiple models locally. Compare accuracy, latency, and cost with zero cloud dependency.
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
            <ScrollAnimation animationType="fadeIn">
              <SectionHeader
                eyebrow="See it in action"
                title="Watch the demo"
                description="See how Prompt LLM Bench helps you run structured benchmarks and compare results."
                align="center"
              />
            </ScrollAnimation>
            <ScrollAnimation animationType="scale" delay={200}>
              <div className="demo-container">
                <YouTubeAutoplayVideo
                  videoId="IQAArdVRpOY"
                  className="demo-video"
                  threshold={0.75}
                />
              </div>
            </ScrollAnimation>
          </Section>

          <DownloadSection
            id="download"
            eyebrow="Download"
            title="Get Prompt LLM Bench"
            description="Choose your platform and follow the guided install steps."
            variant="full"
            showSteps={false}
          />

          <Section id="features">
            <ScrollAnimation animationType="fadeIn">
              <SectionHeader
                eyebrow="Features"
                title="Everything you need"
              />
            </ScrollAnimation>
            <div className="features-grid">
              {featureItems.map((feature, index) => (
                <ScrollAnimation key={feature.title} animationType="slideUp" delay={index * 100}>
                  <div className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </Section>

          <div className="divider"></div>

          <Section id="benefits">
            <ScrollAnimation animationType="fadeIn">
              <SectionHeader
                eyebrow="Why choose us"
                title="Built for performance and control"
                description="Designed from the ground up for teams who need speed, accuracy, and complete data sovereignty."
                align="center"
              />
            </ScrollAnimation>
            <div className="value-grid">
              {valuePoints.map((point, index) => (
                <ScrollAnimation key={point.title} animationType="slideUp" delay={index * 100}>
                  <div className="value-card">
                    <div className="value-icon">{point.icon}</div>
                    <h3 className="value-title">{point.title}</h3>
                    <p className="value-description">{point.description}</p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </Section>

          <Section id="faq">
            <ScrollAnimation animationType="fadeIn">
              <SectionHeader
                eyebrow="FAQ"
                title="Quick answers"
                description="Everything you need before you install."
              />
            </ScrollAnimation>
            <ScrollAnimation animationType="slideUp" delay={200}>
              <Accordion items={faqItems} />
            </ScrollAnimation>
          </Section>

          <Section id="contact">
            <ScrollAnimation animationType="fadeIn">
              <SectionHeader
                eyebrow="Get in touch"
                title="Contact us"
                description="Have questions, feedback, or need support? We'd love to hear from you."
                align="center"
              />
            </ScrollAnimation>
            <ScrollAnimation animationType="slideUp" delay={200}>
              <ContactForm />
            </ScrollAnimation>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
