import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { verifiedFeed } from "@/lib/veritai-data";

export const Route = createFileRoute("/browse")({
  head: () => ({ meta: [{ title: "Verified News — VeritAI" }] }),
  component: Browse,
});

const cats = ["All", "Politics", "Technology", "Sports", "Science", "Finance", "World", "Health"];

function Browse() {
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? verifiedFeed : verifiedFeed.filter((i) => i.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Verified News
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
        Continuously verified, never recycled
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every story here passed through VeritAI's eight-agent pipeline. Trust scores update as
        new evidence comes in.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Button
            key={c}
            variant={cat === c ? "default" : "outline"}
            size="sm"
            onClick={() => setCat(c)}
            className={cat === c ? "bg-primary" : "border-border/60 bg-surface"}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="group flex flex-col overflow-hidden border-border/60 bg-surface/50 transition hover:border-primary/40"
          >
            <div
              className="relative h-36 w-full overflow-hidden border-b border-border/60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.24 0.11 278) 0%, oklch(0.32 0.18 290) 100%)",
              }}
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <Badge className="absolute left-3 top-3 gap-1 border-verified/30 bg-verified/15 text-verified" variant="outline">
                <ShieldCheck className="h-3 w-3" /> {item.verdict}
              </Badge>
              <div className="absolute bottom-3 right-3 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 font-mono text-[11px] backdrop-blur">
                Trust {item.trust}%
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{item.category}</span>
                <span>·</span>
                <span>{item.source}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
              </div>
              <h3 className="mt-3 flex-1 font-display text-base font-medium leading-snug">
                {item.title}
              </h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex -space-x-2">
                  {["R", "B", "A"].map((s, i) => (
                    <div
                      key={i}
                      className="grid h-6 w-6 place-items-center rounded-full border border-background bg-elevated text-[10px] font-medium text-foreground"
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-muted-foreground transition group-hover:text-primary-foreground">
                  View report <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
