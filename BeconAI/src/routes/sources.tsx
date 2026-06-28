import { createFileRoute } from "@tanstack/react-router";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sources } from "@/lib/veritai-data";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [{ title: "Source Leaderboard — VeritAI" }] }),
  component: Sources,
});

function trustColor(t: number) {
  if (t >= 90) return "text-verified";
  if (t >= 70) return "text-info";
  if (t >= 50) return "text-warning";
  return "text-danger";
}

function Sources() {
  const sorted = [...sources].sort((a, b) => b.trust - a.trust);
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Source Leaderboard
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
        Who's historically trustworthy?
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Aggregated trust scores from every claim our agents have ever cross-referenced. Updated
        daily.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {sorted.slice(0, 3).map((s, i) => (
          <Card
            key={s.name}
            className="relative overflow-hidden border-border/60 bg-surface/50 p-6"
          >
            <div className="absolute right-4 top-4 font-display text-6xl font-bold text-elevated/80">
              {i + 1}
            </div>
            <Trophy className={`h-6 w-6 ${i === 0 ? "text-warning" : "text-muted-foreground"}`} />
            <div className="mt-4 font-display text-2xl font-semibold">{s.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.type}</div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Trust
                </div>
                <div className={`font-display text-4xl font-semibold ${trustColor(s.trust)}`}>
                  {s.trust}%
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{s.articles.toLocaleString()}</div>
                <div>articles indexed</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-border/60 bg-surface/50">
        <div className="grid grid-cols-12 gap-4 border-b border-border/60 px-6 py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Source</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2 text-right">Articles</div>
          <div className="col-span-2 text-right">Trust</div>
          <div className="col-span-1 text-right">Δ</div>
        </div>
        {sorted.map((s, i) => (
          <div
            key={s.name}
            className="grid grid-cols-12 items-center gap-4 border-b border-border/40 px-6 py-4 text-sm last:border-0 hover:bg-elevated/30"
          >
            <div className="col-span-1 font-mono text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="col-span-4 font-medium">{s.name}</div>
            <div className="col-span-2">
              <Badge variant="outline" className="border-border/60 bg-background text-[10px]">
                {s.type}
              </Badge>
            </div>
            <div className="col-span-2 text-right font-mono text-muted-foreground">
              {s.articles.toLocaleString()}
            </div>
            <div className="col-span-2 text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full ${s.trust >= 70 ? "bg-verified" : s.trust >= 50 ? "bg-warning" : "bg-danger"}`}
                    style={{ width: `${s.trust}%` }}
                  />
                </div>
                <span className={`font-mono ${trustColor(s.trust)}`}>{s.trust}%</span>
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              {s.trust >= 90 ? (
                <TrendingUp className="h-4 w-4 text-verified" />
              ) : (
                <TrendingDown className="h-4 w-4 text-danger" />
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
