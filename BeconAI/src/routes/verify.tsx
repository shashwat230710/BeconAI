import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Link2,
  Mic,
  Video,
  Image as ImageIcon,
  Upload,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Eye,
  Activity,
  Scale,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [{ title: "Verify content — VeritAI" }],
  }),
  component: Verify,
});

const agentIcons = [Sparkles, Search, ShieldCheck, Scale, Activity, Eye, Gauge, FileText];

function Verify() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const run = () => {
    setRunning(true);
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= 7) {
          clearInterval(id);
          setRunning(false);
          return 7;
        }
        return s + 1;
      });
    }, 380);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Verify News
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Verify any piece of content
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Paste an article, drop a link, or upload audio, video or images. Our agents
            extract claims and check each one against trusted sources.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary-foreground">
          8 agents ready
        </Badge>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-border/60 bg-surface/50 p-6">
          <Tabs defaultValue="text">
            <TabsList className="grid w-full grid-cols-5 bg-background/60">
              <TabsTrigger value="text" className="gap-2"><FileText className="h-4 w-4" />Text</TabsTrigger>
              <TabsTrigger value="url" className="gap-2"><Link2 className="h-4 w-4" />URL</TabsTrigger>
              <TabsTrigger value="audio" className="gap-2"><Mic className="h-4 w-4" />Audio</TabsTrigger>
              <TabsTrigger value="video" className="gap-2"><Video className="h-4 w-4" />Video</TabsTrigger>
              <TabsTrigger value="image" className="gap-2"><ImageIcon className="h-4 w-4" />Image</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-5">
              <Textarea
                placeholder="Paste an article, social post, or any claim you want verified…"
                className="min-h-[220px] resize-none border-border/60 bg-background text-sm"
                defaultValue="Officials announced today that the new vaccine showed 92% efficacy in Phase III trials, completed in under three weeks. They described the result as 'a revolution that will end all disease,' with global distribution beginning next quarter."
              />
            </TabsContent>
            <TabsContent value="url" className="mt-5">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/article"
                  className="h-11 border-border/60 bg-background"
                />
                <Button variant="outline" className="border-border/60 bg-background">
                  Fetch
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                We'll extract the article, metadata and embedded media before verifying.
              </p>
            </TabsContent>
            {["audio", "video", "image"].map((k) => (
              <TabsContent key={k} value={k} className="mt-5">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background/60 p-12 text-center transition hover:border-primary/50 hover:bg-elevated/40">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="font-display text-base">Drop {k} file or click to upload</div>
                  <div className="text-xs text-muted-foreground">
                    {k === "audio" && "WAV, MP3, M4A — up to 25 MB. Cloned voice detection enabled."}
                    {k === "video" && "MP4, MOV, WEBM — up to 200 MB. Deepfake frame analysis runs automatically."}
                    {k === "image" && "JPG, PNG, WEBP — reverse image + AI-generation forensics."}
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-verified" />
              All processing routed through verified-source corpus (2,840 sources)
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border/60 bg-background">
                Save draft
              </Button>
              <Button
                onClick={run}
                disabled={running}
                className="gap-2 bg-primary shadow-[var(--shadow-glow)]"
              >
                {running ? "Running pipeline…" : (
                  <>
                    Verify now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Pipeline panel */}
        <Card className="border-border/60 bg-surface/50 p-6">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Pipeline</div>
            <Badge variant="outline" className="border-border/60 bg-background text-[10px] uppercase tracking-wider">
              {running ? "Running" : step === 7 ? "Complete" : "Idle"}
            </Badge>
          </div>

          <div className="mt-5 space-y-3">
            {[
              "Content extraction",
              "Claim extraction",
              "Evidence search",
              "Evidence ranking",
              "Fact verification",
              "Bias + emotion",
              "Media forensics",
              "Report generator",
            ].map((label, i) => {
              const Icon = agentIcons[i];
              const done = step > i || (!running && step === 7);
              const active = running && step === i;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-md border p-3 transition ${
                    done
                      ? "border-verified/30 bg-verified/5"
                      : active
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/50 bg-background/60"
                  }`}
                >
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-md ${
                      done ? "bg-verified/20 text-verified" : active ? "bg-primary/30 text-primary-foreground" : "bg-elevated text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {done ? "completed" : active ? "processing…" : "queued"}
                    </div>
                  </div>
                  {active && <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
                </div>
              );
            })}
          </div>

          {step === 7 && !running && (
            <Button asChild className="mt-5 w-full gap-2 bg-primary">
              <Link to="/report">View AI report <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
