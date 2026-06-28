import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, MapPin, Video, TrendingUp, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trending } from "@/lib/veritai-data";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live Misinformation Dashboard — VeritAI" }] }),
  component: Live,
});

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${40 - (v / max) * 36}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" className="h-12 w-full">
      <polyline
        fill="none"
        stroke="oklch(0.62 0.22 278)"
        strokeWidth="2"
        points={pts}
      />
      <polyline
        fill="oklch(0.62 0.22 278 / 0.15)"
        stroke="none"
        points={`0,40 ${pts} 100,40`}
      />
    </svg>
  );
}

function Live() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-danger" /> Live · updates every 30s
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Live misinformation dashboard
          </h1>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Fake stories today", value: "1,284", spark: [12, 18, 22, 30, 41, 38, 52, 60, 71], icon: AlertTriangle, color: "danger" },
          { label: "AI-generated detections", value: "342", spark: [4, 9, 8, 15, 19, 22, 30, 34, 41], icon: Activity, color: "primary" },
          { label: "Deepfake videos flagged", value: "57", spark: [2, 3, 5, 4, 9, 8, 12, 14, 18], icon: Video, color: "warning" },
          { label: "Hot region", value: "South Asia", spark: [9, 11, 15, 17, 22, 28, 30, 26, 33], icon: MapPin, color: "info" },
        ].map((m) => (
          <Card key={m.label} className="border-border/60 bg-surface/50 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {m.label}
              </div>
              <m.icon className={`h-4 w-4 text-${m.color}`} />
            </div>
            <div className="mt-3 font-display text-3xl font-semibold">{m.value}</div>
            <div className="mt-2"><Spark values={m.spark} /></div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Flame className="h-3 w-3 text-danger" /> Top viral fakes
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {trending.map((t, i) => (
              <div key={t.id} className="flex items-center gap-4 py-4">
                <div className="font-mono text-xl text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-medium">{t.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{t.category}</span>
                    <span>·</span>
                    <span>{t.region}</span>
                    <span>·</span>
                    <span>{t.sources} sources cited</span>
                  </div>
                </div>
                <Badge variant="outline" className="border-danger/30 bg-danger/10 text-danger">
                  {t.verdict}
                </Badge>
                <div className="w-12 text-right font-mono text-sm text-danger">{t.score}%</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> Trending fake topics
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Election interference", 84],
              ["Vaccine myths", 71],
              ["Crypto endorsements", 63],
              ["Disaster footage reuse", 52],
              ["Celebrity deepfakes", 48],
              ["Climate denial chains", 39],
            ].map(([label, pct]) => (
              <div key={label as string}>
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-danger"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-border/60 bg-background/60 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Most manipulated region
            </div>
            <div className="mt-2 font-display text-2xl font-semibold">South Asia</div>
            <div className="mt-1 text-sm text-muted-foreground">
              412 flagged items in last 24h · +28% vs. weekly average
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
