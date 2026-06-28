import { createFileRoute } from "@tanstack/react-router";
import { Users, Flag, Bot, Database, ShieldAlert, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VeritAI" }] }),
  component: Admin,
});

const stats = [
  { label: "Active users", value: "18,402", delta: "+4.2%", icon: Users },
  { label: "Flagged content", value: "312", delta: "+12", icon: Flag },
  { label: "Model retrain queue", value: "7", delta: "ready", icon: Bot },
  { label: "Indexed sources", value: "2,840", delta: "+18", icon: Database },
];

const queue = [
  { id: "Q-1042", title: "Suspected deepfake interview clip", reporter: "u/anika", severity: "High" },
  { id: "Q-1041", title: "Out-of-context disaster image reused", reporter: "u/marcus", severity: "Medium" },
  { id: "Q-1040", title: "Cloned voice — financial scam audio", reporter: "u/sara", severity: "High" },
  { id: "Q-1039", title: "Misleading headline on health study", reporter: "u/diego", severity: "Low" },
  { id: "Q-1038", title: "AI-generated political quote", reporter: "u/priya", severity: "High" },
];

const sevCls: Record<string, string> = {
  High: "border-danger/30 bg-danger/10 text-danger",
  Medium: "border-warning/30 bg-warning/10 text-warning",
  Low: "border-info/30 bg-info/10 text-info",
};

function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Admin Console
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Operations & moderation
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/60 bg-surface">
            Export audit log
          </Button>
          <Button className="bg-primary">Trigger retrain</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 bg-surface/50 p-5">
            <div className="flex items-center justify-between">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-[11px] text-verified">{s.delta}</span>
            </div>
            <div className="mt-3 font-display text-3xl font-semibold">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Moderation queue</div>
            <Badge variant="outline" className="border-border/60 bg-background">
              {queue.length} pending
            </Badge>
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {queue.map((q) => (
              <div key={q.id} className="flex items-center gap-4 py-4">
                <div className="font-mono text-xs text-muted-foreground">{q.id}</div>
                <div className="flex-1">
                  <div className="font-display text-sm font-medium">{q.title}</div>
                  <div className="text-[11px] text-muted-foreground">Reported by {q.reporter}</div>
                </div>
                <Badge variant="outline" className={sevCls[q.severity]}>
                  {q.severity}
                </Badge>
                <Button size="sm" variant="outline" className="border-border/60 bg-background">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 bg-surface/50 p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Activity className="h-3 w-3" /> Agent health
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Claim Extraction", 99],
                ["Evidence Search", 97],
                ["Fact Verification", 98],
                ["Deepfake Detection", 94],
                ["Bias Detection", 99],
                ["Report Generator", 100],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-xs">
                    <span>{k}</span>
                    <span className="font-mono text-muted-foreground">{v}% uptime</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full bg-gradient-to-r from-verified to-info"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border/60 bg-surface/50 p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldAlert className="h-3 w-3" /> Risk signals
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded border border-danger/30 bg-danger/10 p-3">
                <div className="font-medium text-danger">Surge in deepfake submissions</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  +148% in the past 6h. Recommend re-weighting media forensics agent.
                </div>
              </div>
              <div className="rounded border border-warning/30 bg-warning/10 p-3">
                <div className="font-medium text-warning">Source drift detected</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  3 sources show declining trust scores over the last 7 days.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
