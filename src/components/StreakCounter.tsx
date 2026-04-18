import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const StreakCounter = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const updateStreak = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle();

      if (!data) {
        await supabase.from("streaks").insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_active_date: today });
        setStreak(1);
        return;
      }

      const last = data.last_active_date as string | null;
      let next = data.current_streak;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        next = last === yesterday ? data.current_streak + 1 : 1;
        await supabase.from("streaks").update({
          current_streak: next,
          longest_streak: Math.max(data.longest_streak, next),
          last_active_date: today,
        }).eq("user_id", user.id);
      }
      setStreak(next);
    };
    updateStreak();
  }, [user]);

  if (!user || streak < 1) return null;

  return (
    <div className="flex items-center gap-1.5 glass-gold rounded-full px-3 py-1.5" title={`${streak}-day streak — keep it alive!`}>
      <Flame className="w-3.5 h-3.5 text-primary" />
      <span className="font-display text-xs font-bold text-primary">{streak}</span>
    </div>
  );
};

export default StreakCounter;
