import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Sparkles, TrendingUp, Award, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

const iconFor = (type: string) => {
  switch (type) {
    case "achievement": return Award;
    case "score": return TrendingUp;
    case "ai": return Sparkles;
    default: return CheckCircle2;
  }
};

const NotificationCenter = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => data && setItems(data as Notification[]));

    const channel = supabase
      .channel("notif-" + user.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => setItems((prev) => [payload.new as Notification, ...prev])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unread = items.filter((i) => !i.read).length;

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="glass-gold-deep border-l border-primary/20 w-full sm:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display text-2xl text-foreground flex items-center justify-between">
            Notifications
            {unread > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-primary">
                Mark all read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
          {items.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground">No notifications yet.</p>
              <p className="font-body text-xs text-muted-foreground/70 mt-1">Score updates and achievements will appear here.</p>
            </div>
          )}
          {items.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <div
                key={n.id}
                className={`rounded-xl p-4 transition-all ${n.read ? "glass" : "glass-gold border-shine"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">{n.title}</p>
                    {n.body && <p className="font-body text-xs text-muted-foreground mt-1">{n.body}</p>}
                    <p className="font-body text-[10px] text-muted-foreground/60 mt-2">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
