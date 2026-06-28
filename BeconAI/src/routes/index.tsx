import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  ScanSearch,
  Brain,
  Mic,
  Image as ImageIcon,
  Video,
  Link2,
  FileText,
  Sparkles,
  Activity,
  Globe2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trending } from "@/lib/veritai-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeritAI — Don't just detect fake news. Explain why it's fake." },
      {
        name: "description",
        content:
          "Multi-modal AI verification across text, audio, video and images, with claim-level explanations and trusted-source evidence.",
      },
    ],
  }),
  component: Home,
});

const modes = [
  { icon: FileText, label: "Text" },
  { icon: Link2, label: "URL" },
  { icon: Mic, label: "Audio" },
  { icon: Video, label: "Video" },
  { icon: ImageIcon, label: "Image" },
];

const verdictColor: Record<string, string> = {
  False: "bg-danger/15 text-danger border-danger/30",
  Manipulated: "bg-warning/15 text-warning border-warning/30",
  "Out of Context": "bg-info/15 text-info border-info/30",
  "AI Generated": "bg-primary/20 text-primary-foreground border-primary/40",
};

function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <Badge
            variant="outline"
            className="mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 text-primary-foreground"
          >
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-medium">Research-grade verification, now in beta</span>
          </Badge>

          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-gradient">Don't just detect fake news.</span>
            <br />
            <span className="text-foreground">Explain why it's fake.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            VeritAI verifies text, audio, video and images with an eight-agent pipeline —
            extracting every claim, weighing evidence from trusted sources, and showing you
            exactly where the truth breaks.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 gap-2 bg-primary px-6 text-base shadow-[var(--shadow-glow)]">
              <Link to="/verify">
                Verify content
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 border-border/60 bg-surface/40 px-6 text-base">
              <Link to="/report">See a sample report</Link>
            </Button>
            <div className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-verified" />
              4.8s avg verification • 8 agents
            </div>
          </div>

          {/* Mode strip */}
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Verify any
            </span>
            {modes.map((m) => (
              <Link
                key={m.label}
                to="/verify"
                className="group flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-4 py-2 text-sm text-foreground transition hover:border-primary/50 hover:bg-elevated"
              >
                <m.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border/60 bg-surface/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border/40 md:grid-cols-4">
          {[
            { label: "Articles verified", value: "1.2M", icon: ShieldCheck },
            { label: "Claims extracted today", value: "48,210", icon: ScanSearch },
            { label: "Trusted sources indexed", value: "2,840", icon: Globe2 },
            { label: "Avg. verification time", value: "4.8s", icon: Activity },
          ].map((s) => (
            <div key={s.label} className="bg-background p-6">
              <s.icon className="mb-3 h-4 w-4 text-primary-foreground/70" />
              <div className="font-display text-3xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PIPELINE */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              The pipeline
            </div>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
              Eight specialized agents, one verdict you can actually trust
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden gap-2 text-muted-foreground md:flex">
            <Link to="/report">Inspect a report <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[
            ["01", "Content Extraction", "Speech-to-text, OCR, frame and metadata parsing."],
            ["02", "Claim Extraction", "LLMs decompose articles into discrete factual claims."],
            ["03", "Evidence Search", "Retrieval across WHO, Reuters, journals and knowledge graphs."],
            ["04", "Evidence Ranking", "Source weighting — government 100, blog 20."],
            ["05", "Fact Verification", "Agent reasons claim-by-claim with citations."],
            ["06", "Bias & Emotion", "Sensationalism, framing and manipulation scores."],
            ["07", "Media Forensics", "Deepfake video, cloned voice and synthetic image detection."],
            ["08", "Report Generator", "Interactive, claim-level explainable report."],
          ].map(([n, t, d]) => (
            <Card
              key={n}
              className="border-border/60 bg-surface/50 p-5 transition hover:border-primary/40 hover:bg-elevated/40"
            >
              <div className="font-mono text-xs text-primary-foreground/60">{n}</div>
              <div className="mt-2 font-display text-lg font-semibold">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Trending right now
              </div>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                Misinformation we're actively tracking
              </h2>
            </div>
            <Button asChild variant="outline" className="border-border/60 bg-background">
              <Link to="/live">Open live dashboard</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {trending.map((t) => (
              <Card
                key={t.id}
                className="group border-border/60 bg-background p-6 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="border-border/60 bg-surface text-xs">
                    {t.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${verdictColor[t.verdict] ?? "border-border/60 bg-surface"}`}
                  >
                    {t.verdict}
                  </Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-medium leading-snug">
                  {t.title}
                </h3>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Trust {t.score}%</span>
                    <span>{t.sources} sources</span>
                    <span>{t.region}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <Brain className="mx-auto h-10 w-10 text-primary-foreground" />
          <h2 className="mt-6 font-display text-4xl font-semibold md:text-5xl">
            A verdict is not enough. <span className="text-gradient">Demand the evidence.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Drop in a link, an audio note, or a screenshot. Get a claim-by-claim breakdown
            with cited evidence in seconds.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 gap-2 bg-primary px-6 text-base shadow-[var(--shadow-glow)]">
            <Link to="/verify">
              Start a verification <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
