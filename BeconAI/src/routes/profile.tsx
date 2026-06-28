import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, History, Award, Flag, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { verifiedFeed } from "@/lib/veritai-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Dashboard — VeritAI" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center gap-5">
        <Avatar className="h-16 w-16 border border-border/60">
          <AvatarFallback className="bg-gradient-to-br from-primary to-info text-lg font-semibold">
            AV
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-display text-2xl font-semibold">Ananya Verma</div>
          <div className="text-sm text-muted-foreground">
            Verified contributor · joined Feb 2025
          </div>
        </div>
        <Badge variant="outline" className="gap-1 border-verified/30 bg-verified/10 text-verified">
          <ShieldCheck className="h-3 w-3" /> Trusted reviewer
        </Badge>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Verifications run", value: "248", icon: History },
          { label: "Bookmarks", value: "32", icon: Bookmark },
          { label: "Community flags", value: "17", icon: Flag },
          { label: "Contribution score", value: "1,420", icon: Award },
        ].map((s) => (
          <Card key={s.label} className="border-border/60 bg-surface/50 p-5">
            <s.icon className="h-4 w-4 text-muted-foreground" />
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
            <div className="font-display text-lg font-semibold">Recent verifications</div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View all
            </Button>
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {verifiedFeed.slice(0, 5).map((v) => (
              <div key={v.id} className="flex items-center gap-4 py-4">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-elevated">
                  <ShieldCheck className="h-4 w-4 text-verified" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-sm font-medium">{v.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {v.source} · {v.time}
                  </div>
                </div>
                <Badge variant="outline" className="border-verified/30 bg-verified/10 text-verified">
                  {v.trust}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="font-display text-lg font-semibold">Reputation</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Verified contributions raise your score and weight your community flags.
          </p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Level 4 · Sentinel</span>
              <span className="font-mono">1,420 / 2,000</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full w-[71%] bg-gradient-to-r from-primary to-info" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              ["Accuracy", "96%"],
              ["Helpful flags", "92%"],
              ["Avg. response time", "1.4h"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
