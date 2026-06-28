import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sparkles,
  MessageSquareQuote,
  ExternalLink,
  Download,
  Share2,
  Clock,
  Scale,
  Activity as ActivityIcon,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { claims, agents } from "@/lib/veritai-data";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "AI Report — VeritAI" }] }),
  component: Report,
});

const verdictConfig: Record<
  string,
  { label: string; cls: string; icon: typeof ShieldCheck }
> = {
  verified: { label: "Verified", cls: "bg-verified/15 text-verified border-verified/30", icon: ShieldCheck },
  false: { label: "False", cls: "bg-danger/15 text-danger border-danger/30", icon: XCircle },
  context: { label: "Needs Context", cls: "bg-warning/15 text-warning border-warning/30", icon: AlertTriangle },
  opinion: { label: "Opinion", cls: "bg-info/15 text-info border-info/30", icon: MessageSquareQuote },
  ai: { label: "AI Generated", cls: "bg-primary/20 text-primary-foreground border-primary/40", icon: Sparkles },
};

function Report() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Verification report · #VA-48201
          </div>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold leading-tight md:text-4xl">
            "New vaccine shows 92% efficacy in Phase III trials, distribution begins next quarter"
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Verified 4.8s ago</span>
            <span>·</span>
            <span>Source: example-news.com</span>
            <span>·</span>
            <span>Language: English</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/60 bg-surface">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border/60 bg-surface">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Scorecard */}
      <div className="mt-8 grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-5 border-border/60 bg-surface/50 p-6">
          <div className="flex items-start gap-6">
            <div className="relative grid h-32 w-32 place-items-center">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="oklch(0.30 0.06 280)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#g)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(64 / 100) * 326.7} 326.7`}
                />
                <defs>
                  <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 155)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 278)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <div className="font-display text-4xl font-semibold">64</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Trust</div>
              </div>
            </div>
            <div className="flex-1">
              <Badge className="border-warning/30 bg-warning/15 text-warning" variant="outline">
                Mostly True — with caveats
              </Badge>
              <div className="mt-3 font-display text-2xl font-semibold">Partial verification</div>
              <p className="mt-1 text-sm text-muted-foreground">
                3 of 5 claims fully verified. One claim is false; one is missing critical context;
                one quote appears AI-generated.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded bg-verified/15 px-2 py-1 text-verified">3 verified</span>
                <span className="rounded bg-danger/15 px-2 py-1 text-danger">1 false</span>
                <span className="rounded bg-warning/15 px-2 py-1 text-warning">1 needs context</span>
                <span className="rounded bg-primary/20 px-2 py-1 text-primary-foreground">1 AI-generated</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-7 border-border/60 bg-surface/50 p-6">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              { label: "Confidence", v: 95, icon: ShieldCheck, color: "verified" },
              { label: "Manipulation", v: 22, icon: Eye, color: "info" },
              { label: "Emotion", v: 58, icon: ActivityIcon, color: "warning" },
              { label: "Bias", v: 12, icon: Scale, color: "info" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <m.icon className="h-3 w-3" /> {m.label}
                  </span>
                  <span className="font-mono text-foreground">{m.v}%</span>
                </div>
                <Progress value={m.v} className="mt-2 h-1.5 bg-background" />
              </div>
            ))}
          </div>

          <Separator className="my-5 bg-border/60" />

          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <div className="text-xs text-muted-foreground">Evidence sources</div>
              <div className="mt-1 font-display text-2xl font-semibold">8</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Claims verified</div>
              <div className="mt-1 font-display text-2xl font-semibold">3 / 5</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Cross-language refs</div>
              <div className="mt-1 font-display text-2xl font-semibold">3</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pipeline duration</div>
              <div className="mt-1 font-display text-2xl font-semibold">4.8s</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Claim-level annotation */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Claim-level annotation
              </div>
              <div className="mt-1 font-display text-xl font-semibold">
                Every sentence, individually verified
              </div>
            </div>
            <div className="hidden gap-2 text-[11px] md:flex">
              <Legend swatch="bg-verified" label="Verified" />
              <Legend swatch="bg-danger" label="False" />
              <Legend swatch="bg-warning" label="Context" />
              <Legend swatch="bg-info" label="Opinion" />
              <Legend swatch="bg-primary" label="AI" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {claims.map((c, i) => {
              const cfg = verdictConfig[c.verdict];
              const Icon = cfg.icon;
              return (
                <div
                  key={c.id}
                  className={`rounded-lg border p-4 ${cfg.cls.replace("text-", "border-").split(" ")[0]} bg-background/40`}
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] leading-relaxed text-foreground">{c.text}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`gap-1 text-[11px] ${cfg.cls}`}>
                          <Icon className="h-3 w-3" /> {cfg.label}
                        </Badge>
                        {c.sources.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-border/60 bg-surface px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-surface/50 p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Agent timeline
            </div>
            <div className="mt-1 font-display text-xl font-semibold">Pipeline trace</div>
            <div className="mt-5 space-y-3">
              {agents.map((a, i) => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{a.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{a.ms}ms</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-info"
                        style={{ width: `${Math.min(100, (a.ms / 1900) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border/60 bg-surface/50 p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Evidence sources
            </div>
            <div className="mt-1 font-display text-xl font-semibold">8 trusted references</div>
            <div className="mt-5 space-y-2">
              {[
                ["WHO", 99, "Institution"],
                ["Nature", 97, "Journal"],
                ["Reuters", 98, "Wire"],
                ["AP News", 95, "Wire"],
                ["The Lancet", 96, "Journal"],
                ["BBC", 96, "Broadcast"],
                ["FDA", 97, "Institution"],
                ["The Guardian", 91, "Newspaper"],
              ].map(([name, trust, type]) => (
                <div
                  key={name as string}
                  className="flex items-center justify-between rounded border border-border/50 bg-background/60 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-[11px] text-muted-foreground">{type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-verified">{trust}%</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded border border-border/60 bg-background/60 px-2 py-0.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}
