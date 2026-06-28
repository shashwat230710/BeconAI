import { Search, Bell, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden h-5 w-px bg-border md:block" />

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search claims, sources, articles…"
          className="h-9 border-border/60 bg-surface pl-9 text-sm focus-visible:ring-primary/40"
        />
        <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground md:inline">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Sparkles className="h-4 w-4 text-info" />
          <span className="hidden sm:inline">New verification</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8 border border-border/60">
          <AvatarFallback className="bg-elevated text-xs text-foreground">AV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
